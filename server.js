  // ================= АДМИН ПАНЕЛЬ (ТЕРМИНАЛ) =================
  socket.on('admin:terminal', ({ secret, action, targetUsername, arg1 }) => {
    if (secret !== 'homegram_super_secret_2026') {
      return socket.emit('admin:terminal-result', { ok: false, msg: '❌ Ошибка: Неверный секретный ключ!' });
    }

    const target = db.users.find(u => u.username === targetUsername);
    if (!target) {
      return socket.emit('admin:terminal-result', { ok: false, msg: `❌ Пользователь @${targetUsername} не найден` });
    }

    if (action === 'stars') {
      const amt = Number(arg1) || 0;
      target.stars = Math.max(0, (target.stars || 0) + amt);
      saveDB();
      const s = online.get(target.id);
      if (s) s.emit('profile-updated', publicUser(target));
      socket.emit('admin:terminal-result', { ok: true, msg: `✅ Выдано ${amt} ⭐ пользователю @${targetUsername}. Баланс: ${target.stars}` });
    } else if (action === 'crystals') {
      const amt = Number(arg1) || 0;
      target.crystals = Math.max(0, (target.crystals || 0) + amt);
      saveDB();
      const s = online.get(target.id);
      if (s) s.emit('profile-updated', publicUser(target));
      socket.emit('admin:terminal-result', { ok: true, msg: `✅ Выдано ${amt} 💠 пользователю @${targetUsername}. Баланс: ${target.crystals}` });
    } else if (action === 'premium') {
      const d = Number(arg1);
      if (d === 0 || d === -1) {
        target.premiumUntil = -1;
      } else {
        const base = Math.max(Date.now(), target.premiumUntil > 0 ? target.premiumUntil : 0);
        target.premiumUntil = base + d * 24 * 60 * 60 * 1000;
      }
      saveDB();
      const s = online.get(target.id);
      if (s) s.emit('profile-updated', publicUser(target));
      socket.emit('admin:terminal-result', { ok: true, msg: `✅ Выдан Premium на ${d === 0 ? 'всегда' : d + ' дн.'} для @${targetUsername}` });
    } else if (action === 'nft') {
      const item = NFT_CATALOG.find(x => x.id === arg1 || x.name.toLowerCase() === arg1.toLowerCase());
      if (!item) {
        return socket.emit('admin:terminal-result', { ok: false, msg: `❌ Подарок "${arg1}" не найден. Доступны: ${NFT_CATALOG.map(x => x.id).join(', ')}` });
      }
      target.nfts = target.nfts || [];
      target.nfts.push({
        id: db.nextGiftId++, catalogId: item.id, name: item.name,
        icon: item.icon, emoji: item.emoji, rarity: item.rarity,
        obtainedAt: Date.now(), from: 'админ',
      });
      saveDB();
      const s = online.get(target.id);
      if (s) s.emit('profile-updated', publicUser(target));
      socket.emit('admin:terminal-result', { ok: true, msg: `✅ Выдан подарок "${item.name}" пользователю @${targetUsername}` });
    } else {
      socket.emit('admin:terminal-result', { ok: false, msg: '❌ Неизвестная команда' });
    }
  });