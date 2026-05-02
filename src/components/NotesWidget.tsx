import { useState, useEffect, useRef, useCallback } from "preact/hooks";

const STORAGE_KEY = "homepage-notes";
const DEBOUNCE_MS = 500;
const QUOTA_WARN_RATIO = 0.8;
const ESTIMATED_QUOTA = 5 * 1024 * 1024;

export function getStorageUsage(
  storage: Storage = localStorage,
): number {
  let total = 0;
  try {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key !== null) {
        const value = storage.getItem(key);
        if (value !== null) {
          total += key.length + value.length;
        }
      }
    }
  } catch {
    return 0;
  }
  return total * 2;
}

export function NotesWidget() {
  const [content, setContent] = useState("");
  const [nearQuota, setNearQuota] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const writeFailedRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setContent(saved);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const persistToStorage = useCallback((value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      writeFailedRef.current = true;
    }
  }, []);

  const handleInput = useCallback(
    (e: Event) => {
      const value = (e.target as HTMLTextAreaElement).value;
      setContent(value);

      const usage = getStorageUsage();
      setNearQuota(
        writeFailedRef.current || usage >= ESTIMATED_QUOTA * QUOTA_WARN_RATIO,
      );

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        persistToStorage(value);
      }, DEBOUNCE_MS);
    },
    [persistToStorage],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div class="widget notes-widget">
      <textarea
        class="notes-textarea"
        value={content}
        onInput={handleInput}
        placeholder="Jot down your thoughts..."
        aria-label="Notes scratchpad"
      />
      <div class="notes-footer">
        <span class="notes-count">{content.length} characters</span>
        {nearQuota && (
          <span class="notes-quota-warning" role="alert">
            Storage nearly full
          </span>
        )}
      </div>
    </div>
  );
}
