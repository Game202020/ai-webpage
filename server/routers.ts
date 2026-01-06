import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { createAnalysis, createOwnerNotification, getUserAnalyses, createResume, getUserResume } from "./db";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  hobby: router({
    analyze: protectedProcedure
      .input(z.object({
        hobbiesInput: z.string().min(10, "يرجى إدخال وصف أكثر تفصيلاً للهوايات"),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const prompt = `أنت مستشار مهني متخصص. قم بتحليل الهوايات والاهتمامات التالية واقترح مسار مهني مناسب.

الهوايات والاهتمامات:
${input.hobbiesInput}

يرجى تقديم الرد بصيغة JSON بالعربية تتضمن:
{
  "careerPath": "اسم المسار المهني الرئيسي",
  "description": "وصف تفصيلي للمسار المهني (2-3 جمل)",
  "suggestedCourses": ["دورة 1", "دورة 2", "دورة 3"],
  "suggestedJobs": ["وظيفة 1", "وظيفة 2", "وظيفة 3"],
  "salaryRange": "نطاق الراتب المتوقع"
}`;

          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "أنت مستشار مهني متخصص في تحليل الهوايات وتحويلها إلى مسارات مهنية. قدم ردود بناءة وعملية باللغة العربية."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          });

          let content = response.choices[0]?.message?.content;
          if (typeof content !== 'string') content = '{}';
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          const analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

          await createAnalysis(ctx.user.id, {
            hobbiesInput: input.hobbiesInput,
            careerPath: analysisData.careerPath || "مسار مهني",
            description: analysisData.description,
            suggestedCourses: JSON.stringify(analysisData.suggestedCourses || []),
            suggestedJobs: JSON.stringify(analysisData.suggestedJobs || []),
            salaryRange: analysisData.salaryRange,
          });

          try {
            await notifyOwner({
              title: `تحليل هوايات جديد من ${ctx.user.name || "مستخدم"}`,
              content: `الهوايات: ${input.hobbiesInput}\n\nالمسار المقترح: ${analysisData.careerPath}`
            });
          } catch (notificationError) {
            console.error("Failed to send notification:", notificationError);
          }

          return {
            careerPath: analysisData.careerPath || "مسار مهني",
            description: analysisData.description,
            suggestedCourses: analysisData.suggestedCourses || [],
            suggestedJobs: analysisData.suggestedJobs || [],
            salaryRange: analysisData.salaryRange,
          };
        } catch (error: any) {
          console.error("Analysis error:", error);
          throw new Error("فشل تحليل الهوايات. يرجى المحاولة مرة أخرى.");
        }
      }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      try {
        const analyses = await getUserAnalyses(ctx.user.id);
        return analyses.map(analysis => ({
          ...analysis,
          suggestedCourses: analysis.suggestedCourses ? JSON.parse(analysis.suggestedCourses) : [],
          suggestedJobs: analysis.suggestedJobs ? JSON.parse(analysis.suggestedJobs) : [],
        }));
      } catch (error: any) {
        console.error("Get history error:", error);
        throw new Error("فشل استرجاع السجل التاريخي.");
      }
    }),

    uploadResume: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileBuffer: z.instanceof(Buffer),
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const fileKey = `resumes/${ctx.user.id}/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, input.fileBuffer, input.mimeType);

          await createResume(ctx.user.id, {
            fileName: input.fileName,
            fileKey,
            fileUrl: url,
            fileSize: input.fileBuffer.length,
            mimeType: input.mimeType,
          });

          return { success: true, url };
        } catch (error: any) {
          console.error("Upload resume error:", error);
          throw new Error("فشل رفع السيرة الذاتية.");
        }
      }),

    getResume: protectedProcedure.query(async ({ ctx }) => {
      try {
        const resume = await getUserResume(ctx.user.id);
        return resume || null;
      } catch (error: any) {
        console.error("Get resume error:", error);
        throw new Error("فشل استرجاع السيرة الذاتية.");
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
