(() => {
  chrome.storage.sync.get(
    {
      config: {},
    },
    ({ config }) => {
      const enable = config.enable;
      const items = config.items || [];
      const querys = items.filter((item) => item.enable);

      chrome.runtime.sendMessage({ setStatus: !!enable });

      if (!enable) {
        return;
      }

      const originSearchObj = {};
      const searchObj = {};
      let isDiff = false;

      if (window.location.search) {
        window.location.search
          .slice(1)
          .split("&")
          .map((item) => {
            let [key, value] = item.split("=");
            if (!key) {
              return;
            }
            originSearchObj[key] = value;
          });
      }

      for (let i = 0; i < querys.length; i++) {
        const query = querys[i];
        const urlMatch = query.urlMatch;
        const keys = (query.querys || []).filter((item) => !!item.key);

        if (!urlMatch) {
          continue;
        }

        if (
          urlMatch == window.location.host ||
          window.location.href.indexOf(urlMatch) == 0
        ) {
          keys.map((q) => {
            searchObj[q.key] = q.value || "";
            if (
              isDiff ||
              Object.keys(originSearchObj).length == 0 ||
              Object.keys(originSearchObj).filter((item) => item == q.key)
                .length == 0 ||
              Object.keys(originSearchObj).filter(
                (item) =>
                  item == q.key && originSearchObj[item] != searchObj[q.key]
              ).length
            ) {
              isDiff = true;
            }
          });

          if (isDiff) {
            const _searchObj = { ...originSearchObj, ...searchObj };
            window.location =
              window.location.origin +
              window.location.pathname +
              (Object.keys(_searchObj).length
                ? "?" +
                  Object.keys(_searchObj)
                    .map((key) => key + "=" + _searchObj[key])
                    .join("&") +
                  window.location.hash
                : "");
          }
          break;
        }
      }
    }
  );
})();
