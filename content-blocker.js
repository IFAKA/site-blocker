(function() {
	function blockedUrl(from) {
		const base = chrome.runtime.getURL('blocked.html');
		try {
			const u = new URL(base);
			if (from) u.searchParams.set('from', from);
			return u.toString();
		} catch { return base; }
	}

	function goBlocked(withFrom) {
		const target = blockedUrl(withFrom ? window.location.href : undefined);
		if (window.location.href !== target) {
			window.location.replace(target);
		}
	}

	function isYoutubeAllowed(u) {
		const host = u.hostname;
		if (host === 'youtu.be') return true;
		if (!/(^|\.)youtube\.com$/.test(host)) return false;
		return (
			u.pathname.startsWith('/watch') ||
			u.pathname.startsWith('/shorts/') ||
			u.pathname.startsWith('/embed/')
		);
	}

	function isRedditAllowed(u) {
		if (!/(^|\.)reddit\.com$/.test(u.hostname)) return false;
		return (/^\/r\/[^/]+\/comments\//.test(u.pathname) || /^\/comments\//.test(u.pathname));
	}

	function is4channelAllowed(u) {
		if (u.hostname !== 'boards.4channel.org') return false;
		const allowedBoards = ['sci','g','his','lit','diy','ck','fit'];
		const m = u.pathname.match(/^\/([^/]+)\//);
		return !!(m && allowedBoards.includes(m[1]));
	}

	function isAllowed(u) {
		const host = u.hostname;
		if ((/^([a-z0-9-]+\.)?pinterest\.com$/).test(host)) return false;
		if (host === 'x.com' || host === 'www.x.com') return false;
		if ((/^([a-z0-9-]+\.)?twitter\.com$/).test(host)) return false;
		if (host === 'boards.4chan.org' || host === '4chan.org') return false;
		if ((/^([a-z0-9-]+\.)?pornhub\.com$/).test(host)) return false;
		if ((/^([a-z0-9-]+\.)?xvideos\.com$/).test(host)) return false;
		if ((/^([a-z0-9-]+\.)?xhamster\.com$/).test(host)) return false;
		if ((/^([a-z0-9-]+\.)?redtube\.com$/).test(host)) return false;
		if ((/^([a-z0-9-]+\.)?youporn\.com$/).test(host)) return false;
		if ((/^([a-z0-9-]+\.)?xnxx\.com$/).test(host)) return false;
		if ((/^([a-z0-9-]+\.)?spankbang\.com$/).test(host)) return false;
		if (host === 'rule34.xxx') return false;
		if ((/^([a-z0-9-]+\.)?nhentai\.net$/).test(host)) return false;
		if ((/^([a-z0-9-]+\.)?hanime\.tv$/).test(host)) return false;
		if ((/^([a-z0-9-]+\.)?f95zone\.to$/).test(host)) return false;

		if ((/^([a-z0-9-]+\.)?youtube\.com$/.test(host) || host === 'youtu.be')) {
			return isYoutubeAllowed(u);
		}
		if ((/^([a-z0-9-]+\.)?reddit\.com$/.test(host))) {
			return isRedditAllowed(u);
		}
		if (host === 'boards.4channel.org') {
			return is4channelAllowed(u);
		}
		return true;
	}

	function enforce() {
		try {
			const u = new URL(window.location.href);
			if (!isAllowed(u)) {
				goBlocked(true);
			}
		} catch {}
	}

	enforce();

	let lastHref = location.href;
	const obs = new MutationObserver(() => {
		if (location.href !== lastHref) {
			lastHref = location.href;
			enforce();
		}
	});
	obs.observe(document, {subtree: true, childList: true});
	window.addEventListener('popstate', enforce);
	(function(history){
		const push = history.pushState;
		history.pushState = function(){
			const ret = push.apply(this, arguments);
			enforce();
			return ret;
		};
	})(window.history);
})();
