import { useEffect, useState } from "react";
import { Calendar, Clock, ShieldCheck, Wifi, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportAllData } from "@/lib/storage";

function downloadBackup() {
  const json = exportAllData();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hr-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function TopBar() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString("ar-IQ-u-ca-gregory", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("ar-IQ-u-ca-gregory", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="flex items-center gap-3 px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border arabic-num">
            <Calendar className="size-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">{dateStr}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border arabic-num">
            <Clock className="size-3.5 text-amber" />
            <span className="text-xs font-medium text-foreground">{timeStr}</span>
          </div>
        </div>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-semibold">
            <ShieldCheck className="size-3.5" />
            بياناتك محلية
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-info/10 text-info text-xs font-semibold">
            <Wifi className="size-3.5" />
            يعمل بدون إنترنت
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={downloadBackup} className="gap-2">
          <Download className="size-4" />
          نسخة احتياطية
        </Button>
      </div>
    </header>
  );
}
