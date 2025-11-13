// Moved from components/task/taskDetailsModalModule/commentSectionModule/utils/buildCombinedItems.js
// Combines attachments and comments into a single, chronologically sorted array.
export const buildCombinedItems = (attachments, comments) => {
  const att = Array.isArray(attachments)
    ? attachments.map((a) => ({
        type: "attachment",
        data: a,
        date: a?.uploadedAt || a?.createdAt || null,
        key: a?._id || a?.url || JSON.stringify(a),
      }))
    : [];
  const com = Array.isArray(comments)
    ? comments.map((c) => ({
        type: "comment",
        data: c,
        date: c?.createdAt || null,
        key: c?._id || JSON.stringify(c),
      }))
    : [];
  return [...att, ...com].sort((x, y) => {
    const dx = x.date ? new Date(x.date).getTime() : 0;
    const dy = y.date ? new Date(y.date).getTime() : 0;
    return dy - dx;
  });
};

export default buildCombinedItems;
