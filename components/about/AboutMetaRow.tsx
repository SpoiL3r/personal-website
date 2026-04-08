"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import styles from "./AboutHero.module.css";

function ISTClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      }));

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <>{time} IST</>;
}

export default function AboutMetaRow() {
  const { t } = useLocale();

  return (
    <div className={styles.metaRow}>
      <span className={styles.metaItem}>
        <MapPin size={14} style={{ color: "#ef4444" }} />
        {t.about.location}
      </span>
      <span className={styles.metaItem}>
        <Clock size={14} style={{ color: "#f59e0b" }} />
        <ISTClock />
      </span>
    </div>
  );
}
