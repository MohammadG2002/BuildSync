import { useEffect } from "react";

export function useScrollMessages(listRef, messages, loading) {
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, listRef]);
}
