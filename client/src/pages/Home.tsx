import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Sparkles, Briefcase, TrendingUp, BookOpen } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setLocation("/analyze");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-foreground">حولّ هواياتك لمهنة</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                <Button onClick={() => setLocation("/profile")} variant="outline" size="sm">
                  ملفي الشخصي
                </Button>
              </div>
            ) : (
              <Button onClick={() => (window.location.href = getLoginUrl())} size="sm">
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                اكتشف مسارك المهني من خلال هواياتك
              </h1>
              <p className="text-lg text-muted-foreground">
                استخدم قوة الذكاء الاصطناعي لتحليل هواياتك وتحويلها إلى فرص مهنية حقيقية. احصل على توصيات مخصصة للدورات والوظائف والرواتب.
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleGetStarted} size="lg" className="bg-accent hover:bg-accent/90">
                ابدأ الآن
                <Sparkles className="w-4 h-4 mr-2" />
              </Button>
              <Button onClick={() => setLocation("/about")} variant="outline" size="lg">
                تعرف أكثر
              </Button>
            </div>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl border border-accent/20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Sparkles className="w-16 h-16 text-accent mx-auto" />
              <p className="text-muted-foreground">تحليل ذكي للهوايات</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            لماذا تختار منصتنا؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم توصيات دقيقة ومخصصة لك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/50 hover:border-accent/50 transition-colors">
            <CardHeader>
              <Sparkles className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">تحليل ذكي</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                يستخدم GPT-4 لفهم هواياتك بعمق وتقديم توصيات دقيقة
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-accent/50 transition-colors">
            <CardHeader>
              <Briefcase className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">مسارات مهنية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                اكتشف الوظائف المناسبة لهواياتك مع معلومات الرواتب
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-accent/50 transition-colors">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">دورات تدريبية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                احصل على قائمة بأفضل الدورات لتطوير مهاراتك
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-accent/50 transition-colors">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">تتبع التقدم</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                احفظ تحليلاتك ورقب تطورك عبر الوقت
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            هل أنت مستعد لاكتشاف مسارك المهني؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ابدأ رحلتك الآن واحصل على توصيات مخصصة تساعدك على تحويل هواياتك إلى مهنة ناجحة
          </p>
          <Button onClick={handleGetStarted} size="lg" className="bg-accent hover:bg-accent/90">
            ابدأ التحليل الآن
            <Sparkles className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8 mt-20">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 حولّ هواياتك لمهنة. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
