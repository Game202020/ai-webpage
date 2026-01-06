import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Analyze() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [hobbies, setHobbies] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>يرجى تسجيل الدخول</CardTitle>
            <CardDescription>
              تحتاج إلى تسجيل الدخول للوصول إلى هذه الصفحة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (!hobbies.trim()) {
      toast.error("يرجى إدخال بعض الهوايات");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Call the analyze procedure
      const mutation = trpc.hobby.analyze.useMutation();
      const result = await mutation.mutateAsync({
        hobbiesInput: hobbies,
      });
      setResult(result);
      toast.success("تم التحليل بنجاح!");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء التحليل");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            حلل هواياتك الآن
          </h1>
          <p className="text-lg text-muted-foreground">
            أخبرنا عن هواياتك واهتماماتك وسنساعدك في اكتشاف مسارك المهني المثالي
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  أدخل هواياتك
                </CardTitle>
                <CardDescription>
                  اكتب هواياتك واهتماماتك بالتفصيل
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="مثال: أحب البرمجة والتصميم الجرافيكي، وأستمتع بحل المشاكل..."
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  className="min-h-32 resize-none"
                  disabled={isAnalyzing}
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !hobbies.trim()}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      حلل الآن
                      <Sparkles className="w-4 h-4 mr-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-4">
                {/* Career Path Card */}
                <Card className="border-accent/20 bg-accent/5">
                  <CardHeader>
                    <CardTitle className="text-2xl text-accent">
                      {result.careerPath}
                    </CardTitle>
                    <CardDescription>
                      المسار المهني المقترح
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{result.description}</p>
                  </CardContent>
                </Card>

                {/* Salary Range */}
                {result.salaryRange && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">نطاق الراتب المتوقع</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-accent">
                        {result.salaryRange}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Suggested Courses */}
                {result.suggestedCourses && result.suggestedCourses.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">الدورات المقترحة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.suggestedCourses.map((course: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                            <span className="text-foreground">{course}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Suggested Jobs */}
                {result.suggestedJobs && result.suggestedJobs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">الوظائف المناسبة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.suggestedJobs.map((job: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                            <span className="text-foreground">{job}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setLocation("/history")}
                    variant="outline"
                    className="flex-1"
                  >
                    عرض السجل
                  </Button>
                  <Button
                    onClick={() => setLocation("/profile")}
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    رفع السيرة الذاتية
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center border-dashed">
                <div className="text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    أدخل هواياتك في الجانب الأيسر لبدء التحليل
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
