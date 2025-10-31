// Handle file input change event
const handleChange = (e, handleFiles) => {
  if (e.target.files && e.target.files.length > 0) {
    handleFiles(Array.from(e.target.files));
  }
};

export default handleChange;
