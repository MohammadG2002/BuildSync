/**
 * Creates a click outside handler that closes menus/dropdowns when clicking outside their refs
 * @param {Object} refs - Object containing refs to check (e.g., { menuRef1, menuRef2 })
 * @param {Object} setters - Object containing state setters for each ref (e.g., { setMenu1: false, setMenu2: false })
 * @returns {Function} Event handler function
 */
export const createClickOutsideHandler = (refs, setters) => {
  return (event) => {
    Object.entries(refs).forEach(([key, ref]) => {
      if (ref.current && !ref.current.contains(event.target)) {
        const setter = setters[key];
        if (setter) {
          setter(false);
        }
      }
    });
  };
};

/**
 * Simple click outside handler for a single ref
 * @param {React.RefObject} ref - Ref to the element
 * @param {Function} callback - Callback to execute when clicking outside
 * @returns {Function} Event handler function
 */
export const handleClickOutside = (ref, callback) => {
  return (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };
};
