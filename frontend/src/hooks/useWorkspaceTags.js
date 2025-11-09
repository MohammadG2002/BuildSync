import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { WorkspaceContext } from "../context/WorkspaceContext";
import { getTags as fetchTags } from "../services/tagService";

// Simple in-memory cache per workspace id
const cache = new Map(); // wsId -> { ts, items: Array, map: Map(name->def) }

export const useWorkspaceTags = () => {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const wsId = currentWorkspace?.id || currentWorkspace?._id || null;
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = async () => {
    if (!wsId) return;
    setLoading(true);
    try {
      const list = await fetchTags(wsId);
      const byName = new Map();
      (Array.isArray(list) ? list : []).forEach((t) => {
        if (t?.name) byName.set(String(t.name), t);
      });
      cache.set(wsId, { ts: Date.now(), items: list, map: byName });
      if (mounted.current) setVersion((v) => v + 1);
    } catch (_) {
      // ignore
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  // Initial load or when workspace changes
  useEffect(() => {
    if (!wsId) return;
    // if not cached, load once
    if (!cache.has(wsId)) {
      load();
    }
  }, [wsId]);

  // Listen for global tag changes
  useEffect(() => {
    const onChanged = () => load();
    window.addEventListener("tags:changed", onChanged);
    return () => window.removeEventListener("tags:changed", onChanged);
  }, [wsId]);

  const tagMap = useMemo(() => {
    const entry = wsId ? cache.get(wsId) : null;
    return entry?.map || new Map();
  }, [wsId, version]);

  return { tagMap, reloadTags: load, loading };
};

export default useWorkspaceTags;
