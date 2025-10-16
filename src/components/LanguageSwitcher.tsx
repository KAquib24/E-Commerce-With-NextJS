"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (newLocale: string) => {
    // Extract current locale from pathname
    const segments = pathname.split('/');
    const currentLocale = segments[1];
    
    // Replace the locale segment
    if (['en', 'ja'].includes(currentLocale)) {
      segments[1] = newLocale;
    } else {
      // If no locale in path, add it at the beginning
      segments.splice(1, 0, newLocale);
    }
    
    const newPathname = segments.join('/');
    
    startTransition(() => {
      router.push(newPathname);
    });
  };

  // Get current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    <select
      value={currentLocale}
      onChange={(e) => changeLanguage(e.target.value)}
      disabled={isPending}
      className="border rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="en">🇺🇸 English</option>
      <option value="ja">🇯🇵 日本語</option>
    </select>
  );
}