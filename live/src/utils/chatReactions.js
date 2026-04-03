export const normalizeReactionsSinglePerUser = (reactions) => {
  if (!Array.isArray(reactions)) return [];

  const selectedEmojiByUser = new Map();

  reactions.forEach((reaction) => {
    if (!reaction?.emoji || !Array.isArray(reaction.user_ids)) return;

    reaction.user_ids.forEach((userId) => {
      selectedEmojiByUser.set(String(userId), reaction.emoji);
    });
  });

  return reactions
    .map((reaction) => {
      if (!reaction?.emoji || !Array.isArray(reaction.user_ids)) return null;

      const seen = new Set();
      const userIds = reaction.user_ids.filter((userId) => {
        const key = String(userId);
        if (seen.has(key)) return false;
        seen.add(key);
        return selectedEmojiByUser.get(key) === reaction.emoji;
      });

      if (userIds.length === 0) return null;
      return { ...reaction, user_ids: userIds };
    })
    .filter(Boolean);
};

export const getSingleReactionPlan = (reactions, userId, selectedEmoji) => {
  const normalizedReactions = normalizeReactionsSinglePerUser(reactions);
  const normalizedUserId = String(userId);
  const currentUserEmojis = normalizedReactions
    .filter((reaction) =>
      reaction.user_ids.some((id) => String(id) === normalizedUserId),
    )
    .map((reaction) => reaction.emoji);

  const uniqueCurrentUserEmojis = [...new Set(currentUserEmojis)];
  const alreadySelected = uniqueCurrentUserEmojis.includes(selectedEmoji);
  const nextSelectedEmoji =
    alreadySelected && uniqueCurrentUserEmojis.length === 1
      ? null
      : selectedEmoji;
  const emojisToRemove =
    alreadySelected && uniqueCurrentUserEmojis.length === 1
      ? [selectedEmoji]
      : alreadySelected
        ? uniqueCurrentUserEmojis.filter((emoji) => emoji !== selectedEmoji)
        : uniqueCurrentUserEmojis;

  const nextReactions = normalizedReactions
    .map((reaction) => ({
      ...reaction,
      user_ids: reaction.user_ids.filter(
        (id) => String(id) !== normalizedUserId,
      ),
    }))
    .filter((reaction) => reaction.user_ids.length > 0);

  if (nextSelectedEmoji) {
    const existingReaction = nextReactions.find(
      (reaction) => reaction.emoji === nextSelectedEmoji,
    );

    if (existingReaction) {
      existingReaction.user_ids = [...existingReaction.user_ids, userId];
    } else {
      nextReactions.push({ emoji: nextSelectedEmoji, user_ids: [userId] });
    }
  }

  return {
    emojiToAdd: alreadySelected ? null : selectedEmoji,
    emojisToRemove,
    nextSelectedEmoji,
    nextReactions,
  };
};

export const applyCurrentUserReactionOverride = (
  reactions,
  userId,
  overrideEmoji,
) => {
  const normalizedReactions = normalizeReactionsSinglePerUser(reactions);
  if (userId === undefined || userId === null) {
    return normalizedReactions;
  }

  const normalizedUserId = String(userId);
  const nextReactions = normalizedReactions
    .map((reaction) => ({
      ...reaction,
      user_ids: reaction.user_ids.filter(
        (id) => String(id) !== normalizedUserId,
      ),
    }))
    .filter((reaction) => reaction.user_ids.length > 0);

  if (overrideEmoji) {
    const existingReaction = nextReactions.find(
      (reaction) => reaction.emoji === overrideEmoji,
    );

    if (existingReaction) {
      existingReaction.user_ids = [...existingReaction.user_ids, userId];
    } else {
      nextReactions.push({ emoji: overrideEmoji, user_ids: [userId] });
    }
  }

  return nextReactions;
};
