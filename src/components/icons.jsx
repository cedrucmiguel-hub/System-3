export function Icon({ name, className = "icon" }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };

  switch (name) {
    case "home":
      return <svg {...common}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></svg>;
    case "gift":
      return <svg {...common}><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13" /><path d="M3 12h18" /><path d="M12 8c-2.2 0-4-1.2-4-2.7C8 4 9 3 10.3 3 12 3 12 8 12 8z" /><path d="M12 8c2.2 0 4-1.2 4-2.7C16 4 15 3 13.7 3 12 3 12 8 12 8z" /></svg>;
    case "activity":
      return <svg {...common}><path d="M3 12h4l2-5 4 10 2-5h6" /></svg>;
    case "award":
      return <svg {...common}><circle cx="12" cy="8.5" r="4.5" /><path d="M8.5 13.5 7 21l5-3 5 3-1.5-7.5" /></svg>;
    case "user":
      return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.6-3.5 4.5-5 8-5s6.4 1.5 8 5" /></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></svg>;
    case "up":
      return <svg {...common}><path d="m7 17 10-10" /><path d="M8 7h9v9" /></svg>;
    case "down":
      return <svg {...common}><path d="m7 7 10 10" /><path d="M8 17h9V8" /></svg>;
    case "share":
      return <svg {...common}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.7 6.8-3.4" /><path d="m8.6 13.3 6.8 3.4" /></svg>;
    case "clipboard":
      return <svg {...common}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4.5h6" /></svg>;
    case "cart":
      return <svg {...common}><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /><path d="M3 4h2l2.2 10.5h10.8l2-8H7.2" /></svg>;
    case "filter":
      return <svg {...common}><path d="M4 5h16l-6 7v6l-4 2v-8L4 5z" /></svg>;
    case "sort":
      return <svg {...common}><path d="M7 17V7" /><path d="m4 10 3-3 3 3" /><path d="M17 7v10" /><path d="m14 14 3 3 3-3" /></svg>;
    case "bookmark":
      return <svg {...common}><path d="M7 4h10a1 1 0 0 1 1 1v16l-6-3-6 3V5a1 1 0 0 1 1-1z" /></svg>;
    case "send":
      return <svg {...common}><path d="m22 2-9 20-2.5-8.5L2 11z" /><path d="M22 2 10.5 13.5" /></svg>;
    case "check":
      return <svg {...common}><path d="m5 12 4 4 10-10" /></svg>;
    case "wallet":
      return <svg {...common}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 9h18" /><path d="M16 13h2" /></svg>;
    case "menu":
      return <svg {...common}><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></svg>;
    case "x":
      return <svg {...common}><path d="m6 6 12 12" /><path d="m18 6-12 12" /></svg>;
    case "edit":
      return <svg {...common}><path d="M12 20h9" /><path d="m16.5 3.5 4 4L8 20l-4 1 1-4z" /></svg>;
    case "save":
      return <svg {...common}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
}
