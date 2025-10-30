const filterContacts = (contacts, searchQuery) => {
  return contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export default filterContacts;
