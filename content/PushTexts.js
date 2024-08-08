export default (type, lang, name) => {
  if (type === 'newFriendRequest' && lang === 'de')
    return `🍻 ${name} möchte mt dir befreundet sein. 🍻`;
  if (type === 'newFriendRequest' && lang === 'en')
    return `🍻 ${name} wants to be friends with you. 🍻`;
  if (type === 'acceptedFriendsRequest' && lang === 'de')
    return `🥰 ${name} hat deine Freundschaftsanfrage angenommen. 🥰`;
  if (type === 'acceptedFriendsRequest' && lang === 'en')
    return `🥰 ${name} accepted your friends request. 🥰`;
  if (type === 'newPubIn' && lang === 'de')
    return `📷 ${name} hat gerade ein neues PubIn geteilt. 📷`;
  if (type === 'newPubIn' && lang === 'en')
    return `📷 ${name} just created a new PubIn. 📷`;
  if (type === 'pubInReaction' && lang === 'de')
    return `📷 ${name} hat auf dein PubIn reagiert. 📷`;
  if (type === 'pubInReaction' && lang === 'en')
    return `📷 ${name} has reacted to your PubIn. 📷`;
  if (type === 'newBundle' && lang === 'de')
    return `📦 ${name} hat gerade ein neues PubBundle erstellt. 📦`;
  if (type === 'newBundle' && lang === 'en')
    return `📦 ${name} just created a new PubBundle. 📦`;
  if (lang === 'en') return 'News from PubUp';
  return 'Neuigkeiten von PubUp.';
};
