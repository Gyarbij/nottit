import localForage from "localforage";
import React, { useState, useContext, useEffect, useReducer } from "react";

export const localRead = localForage.createInstance({ storeName: "readPosts" });
export const localSubInfoCache = localForage.createInstance({
  storeName: "subInfoCache",
});
export const subredditFilters = localForage.createInstance({
  storeName: "subredditFilters",
});
export const userFilters = localForage.createInstance({
  storeName: "userFilters",
});

export const MainContext: any = React.createContext({});

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainProvider = ({ children }) => {
  const [pauseAll, setPauseAll] = useState(false); //pauses all media when a post is opened
  const [loading, setLoading] = useState(false); //used in feed to display load bar
  const [ready, setReady] = useState(false); //prevents any feed load until settings are loaded
  const [postOpen, setPostOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [columns, setColumns] = useState(3);
  const [posts, setPosts] = useState<[any?]>([]);
  const [postNum, setPostNum] = useState(0);
  const [token, setToken] = useState();
  const [gAfter, setGAfter] = useState("");
  const [forceRefresh, setForceRefresh] = useState(0);
  const [fastRefresh, setFastRefresh] = useState(0);

  //settings. Initialized to undefined but defaults loaded in initial useEffect if previous setting not found
  const [nsfw, setNSFW] = useState<boolean>();
  const [autoplay, setAutoplay] = useState<boolean>();
  const [hoverplay, setHoverPlay] = useState<boolean>();
  const [columnOverride, setColumnOverride] = useState<number>();
  const [audioOnHover, setaudioOnHover] = useState<boolean>();
  //controls how feed appears, switches to true when in multicolumn mode
  const [wideUI, setWideUI] = useState<boolean>();
  //saves toggle selection. Used to sync UI when switching back to 1 column. Also used to control postModal view
  const [saveWideUI, setSaveWideUI] = useState<boolean>();
  //if posts should also be wide ui/narrow ui
  const [syncWideUI, setSyncWideUI] = useState<boolean>();
  const [postWideUI, setPostWideUI] = useState<boolean>();
  //card style
  const [mediaOnly, setMediaOnly] = useState<boolean>();
  const [cardStyle, setCardStyle] = useState<string>("");

  //new settings..
  const [collapseChildrenOnly, setCollapseChildrenOnly] = useState<boolean>();
  const [defaultCollapseChildren, setDefaultCollapseChildren] =
    useState<boolean>();
  const [showUserIcons, setShowUserIcons] = useState<boolean>();
  const [showAwardings, setShowAwardings] = useState<boolean>();
  const [showFlairs, setShowFlairs] = useState<boolean>();
  const [showUserFlairs, setShowUserFlairs] = useState<boolean>();
  const [expandedSubPane, setExpandedSubPane] = useState<boolean>();
  const [infiniteLoading, setInfinitLoading] = useState<boolean>(); 
  const [dimRead, setDimRead] = useState<boolean>(); 
  const [autoRead, setAutoRead] = useState<boolean>();
  const [disableEmbeds, setDisableEmbeds] = useState<boolean>();
  const [preferEmbeds, setPreferEmbeds] = useState<boolean>(); 
  const [embedsEverywhere, setEmbedsEveryWhere] = useState<boolean>(); 
  const toggleDefaultCollapseChildren = () => {
    setDefaultCollapseChildren((d) => !d);
  };
  const toggleCollapseChildrenOnly = () => {
    if (!defaultCollapseChildren) {
      setCollapseChildrenOnly((d) => !d);
    }
  };
  useEffect(() => {
    defaultCollapseChildren && setCollapseChildrenOnly(true);
  }, [defaultCollapseChildren]);
  const toggleShowUserIcons = () => {
    setShowUserIcons((s) => !s);
  };
  const toggleShowAwardings = () => {
    setShowAwardings((s) => !s);
  };
  const toggleShowFlairs = () => {
    setShowFlairs((s) => !s);
  };
  const toggleShowUserFlairs = () => {
    setShowUserFlairs((s) => !s);
  };
  const toggleExpandedSubPane = () => {
    setExpandedSubPane((e) => !e);
  };
  const toggleInfiniteLoading = () => {
    setInfinitLoading(i => !i)
  }
  const toggleDimRead = () => {
    setDimRead(d => !d)
  }
  const toggleAutoRead = () => {
    setAutoRead(r => !r)
  }
  const toggleDisableEmbeds = () => {
    setDisableEmbeds(d => {
      if (!d){
        setPreferEmbeds(false); 
        setEmbedsEveryWhere(false); 
      }
      return !d;
      })
  }
  const togglePreferEmbeds = () => {
    setPreferEmbeds(p => {
      if (!p){
        setDisableEmbeds(false);
      }
      return !p;
    })
  }
  const toggleEmbedsEverywhere = () => {
    setEmbedsEveryWhere(e => {
      if (!e){
        setDisableEmbeds(false); 
      }
      return !e; 
    })
  }

  //toggle for type of posts to show in saved screen
  const [userPostType, setUserPostType] = useState("links");
  const toggleUserPostType = () => {
    setUserPostType((p) => {
      if (p === "links") return "comments";
      return "links";
    });
  };

  const [readPosts, setReadPosts] = useState<{}>({});
  const [readPostsChange, setReadPostsChange] = useState<number>(0);
  const addReadPost = (postid) => {
    localRead.setItem(postid, new Date());
    setReadPosts((read) => {
      setReadPostsChange(n => n+1);

      if (Object.keys(read).length < 1000) {
        read[postid] = new Date();
        return read;
      }
      //resetting object if space becomes too large
      let newread = {};
      newread[postid] = new Date();
      return newread;
    });
    
  };
  const toggleReadPost = async (postid) => {
    setReadPosts((read) => {
      if (read?.[postid]) {
        localRead.removeItem(postid);
        delete read[postid];
      } else {
        read[postid] = new Date();
        localRead.setItem(postid, new Date());
      }
      //localStorage.setItem("readPosts", JSON.stringify(read));
      setReadPostsChange(n => n+1);

      return read;
    });
  };
 
  //filters in the inverse sense, true = allowed
  const [readFilter, setReadFilter] = useState<boolean>();
  const [imgFilter, setImgFilter] = useState<boolean>();
  const [vidFilter, setVidFilter] = useState<boolean>();
  const [galFilter, setGalFilter] = useState<boolean>();
  const [selfFilter, setSelfFilter] = useState<boolean>();
  const [linkFilter, setLinkFilter] = useState<boolean>();
  // const [filterCount, setFilterCount] = useState(0);
  //advanced filters
  //'img' filters also apply to reddit videos since those have known res as well..
  const [imgPortraitFilter, setImgPortraitFilter] = useState<boolean>();
  const [imgLandscapeFilter, setImgLandScapeFilter] = useState<boolean>();
  const [imgResFilter, setImgResFilter] = useState(false);
  const [imgResXFilter, setImgResXFilter] = useState(0);
  const [imgResYFilter, setImgResYFilter] = useState(0);
  const [imgResExactFilter, setImgResExactFilter] = useState(false);
  const [scoreFilter, setScoreFilter] = useState(false);
  const [scoreFilterNum, setScoreFilterNum] = useState();
  const [scoreGreater, setScoreGreater] = useState(true);

  const [replyFocus, setReplyFocus] = useState(false);
  const [updateFilters, setUpdateFilters] = useState(0);
  const toggleFilter = (filter) => {
    switch (filter) {
      case "read":
        setReadFilter((r) => !r);
        break;
      case "images":
        //toggle off orientation filters if no videos and images
        if (imgFilter === true && vidFilter === false) {
          setImgPortraitFilter(false);
          setImgLandScapeFilter(false);
        }
        //toggle orientation filters on automatically if enabling images
        if (
          imgFilter === false &&
          vidFilter === false &&
          imgPortraitFilter === false &&
          imgLandscapeFilter === false
        ) {
          setImgPortraitFilter(true);
          setImgLandScapeFilter(true);
        }
        setImgFilter((i) => !i);
        break;
      case "videos":
        //toggle off orientation filters if no videos and images
        if (imgFilter === false && vidFilter === true) {
          setImgPortraitFilter(false);
          setImgLandScapeFilter(false);
        }
        //toggle orientation filter on automatically if enabling videos
        if (
          vidFilter === false &&
          imgFilter === false &&
          imgPortraitFilter === false &&
          imgLandscapeFilter === false
        ) {
          setImgPortraitFilter(true);
          setImgLandScapeFilter(true);
        }
        setVidFilter((v) => !v);
        break;
      case "galleries":
        setGalFilter((g) => !g);
        break;
      case "self":
        setSelfFilter((s) => !s);
        break;
      case "links":
        setLinkFilter((l) => !l);
        break;
      case "score":
        setScoreFilter((s) => !s);
        break;
      case "portrait":
        //if orientation toggled on and video+images toggled off, toggle them on
        if (
          imgPortraitFilter === false &&
          imgFilter === false &&
          vidFilter === false
        ) {
          setImgFilter(true);
          setVidFilter(true);
        }
        //if both orientations toggled off, also toggle off image/video filter
        if (imgPortraitFilter === true && imgLandscapeFilter === false) {
          setImgFilter(false);
          setVidFilter(false);
        }
        setImgPortraitFilter((p) => !p);
        break;
      case "landscape":
        //if orientation toggled on and video+images toggled off, toggle them on
        if (
          imgLandscapeFilter === false &&
          imgFilter === false &&
          vidFilter === false
        ) {
          setImgFilter(true);
          setVidFilter(true);
        }
        //if both orientations toggled off, also toggle off image/video filter
        if (imgLandscapeFilter === true && imgPortraitFilter === false) {
          setImgFilter(false);
          setVidFilter(false);
        }
        setImgLandScapeFilter((l) => !l);
        break;
    }
  };

  const updateLikes = (i, like) => {
    if (posts?.[i]?.data) {
      setPosts((p) => {
        p[i].data.likes = like;
        return p;
      });
    }
  };

  const updateSaves = (i, save) => {
    if (posts?.[i]?.data) {
      setPosts((p) => {
        p[i].data.saved = save;
        return p;
      });
    }
  };
  const updateHidden = (i, hidden) => {
    let p = posts;
    if (p?.[i]?.data) {
      setPosts((p) => {
        p[i].data.hidden = hidden;
        return p;
      });
    }
  };

  const [localSubs, setLocalSubs] = useState([]);
  const subToSub = async (action, sub) => {
    if (action == "sub") {
      return await addLocalSub(sub);
    } else if (action == "unsub") {
      return await removeLocalSub(sub);
    } else return false;
  };
  const addLocalSub = async (sub) => {
    let found = localSubs.find((s) => s?.toUpperCase() === sub?.toUpperCase());
    if (!found) {
      setLocalSubs((p) => [...p, sub]);
    }
    return true;
  };
  const removeLocalSub = async (sub) => {
    setLocalSubs((p) => {
      let filtered = p.filter((s) => s?.toUpperCase() !== sub?.toUpperCase());
      if (!(filtered.length > 0)) {
        localStorage.removeItem("localSubs");
        localForage.setItem("localSubs", []);
      }
      return filtered;
    });
    return true;
  };

  const toggleAudioOnHover = () => {
    setaudioOnHover((a) => !a);
  };

  const toggleMediaOnly = () => {
    setMediaOnly((m) => !m);
  };

  //syncs wideui and savedwide ui
  const toggleWideUI = () => {
    setSaveWideUI((w) => {
      setWideUI(!w);
      syncWideUI && setPostWideUI(!w);
      return !w;
    });
  };
  //to force refresh feed so width set properly when in one column mode
  useEffect(() => {
    cardStyle !== "row1" &&
      columnOverride === 1 &&
      setFastRefresh((f) => f + 1);
  }, [wideUI]);

  const toggleSyncWideUI = () => {
    setSyncWideUI((w) => {if (!w){setPostWideUI(saveWideUI)} return !w});
  };

  const togglePostWideUI = () => {
    setPostWideUI((w) => !w);
  };

  const toggleNSFW = () => {
    setNSFW((prevNSFW) => !prevNSFW);
  };
  const toggleHoverPlay = () => {
    setHoverPlay((a) => !a);
  };
  const toggleAutoplay = () => {
    setAutoplay((a) => !a);
  };
  const toggleLoginModal = () => {
    setLoginModal((m) => !m);
  };

  useEffect(() => {
    const getSettings = async () => {
      //fall back to localstorage for legacy settings
      let fallback = false;
      const loadNSFW = async () => {
        let saved_nsfw = await localForage.getItem("nsfw");
        if (saved_nsfw !== null) {
          saved_nsfw === true ? setNSFW(true) : setNSFW(false);
          localStorage.removeItem("nsfw");
        } else {
          fallback = true;
          let local_nsfw = localStorage.getItem("nsfw");
          local_nsfw?.includes("true") ? setNSFW(true) : setNSFW(false);
        }
      };

      const loadAutoplay = async () => {
        let saved_autoplay = await localForage.getItem("autoplay");
        if (saved_autoplay !== null) {
          saved_autoplay === true ? setAutoplay(true) : setAutoplay(false);
          localStorage.removeItem("autoplay");
        } else {
          fallback = true;
          let local_autoplay = localStorage.getItem("autoplay");
          local_autoplay?.includes("true")
            ? setAutoplay(true)
            : setAutoplay(false);
        }
      };

      const loadHoverPlay = async () => {
        let saved_hoverplay = await localForage.getItem("hoverplay");
        if (saved_hoverplay !== null) {
          saved_hoverplay === true ? setHoverPlay(true) : setHoverPlay(false);
          localStorage.removeItem("hoverplay");
        } else {
          fallback = true;
          let local_hoverplay = localStorage.getItem("hoverplay");
          local_hoverplay?.includes("true")
            ? setHoverPlay(true)
            : setHoverPlay(false);
        }
      };

      const loadMediaOnly = async () => {
        let saved_mediaOnly: boolean = await localForage.getItem("mediaOnly");
        if (saved_mediaOnly !== null) {
          saved_mediaOnly === true ? setMediaOnly(true) : setMediaOnly(false);
          localStorage.removeItem("mediaOnly");
        } else {
          fallback = true;
          let local_mediaOnly = localStorage.getItem("mediaOnly");
          local_mediaOnly?.includes("true")
            ? setMediaOnly(true)
            : setMediaOnly(false);
        }
      };

      const audioOnHover = async () => {
        let saved_audioOnHover = await localForage.getItem("audioOnHover");
        if (saved_audioOnHover !== null) {
          saved_audioOnHover === true
            ? setaudioOnHover(true)
            : setaudioOnHover(false);
          localStorage.removeItem("audioOnHover");
        } else {
          fallback = true;
          let local_audioOnHover = localStorage.getItem("audioOnHover");
          local_audioOnHover?.includes("true")
            ? setaudioOnHover(true)
            : setaudioOnHover(false);
        }
      };

      const columnOverride = async () => {
        let saved_columnOverride: number = await localForage.getItem(
          "columnOverride"
        );
        if (saved_columnOverride !== null) {
          saved_columnOverride > 0
            ? setColumnOverride(saved_columnOverride)
            : setColumnOverride(0);
          localStorage.removeItem("columnOverride");
        } else {
          fallback = true;
          let local_columnOverride = parseInt(
            localStorage.getItem("columnOverride")
          );
          local_columnOverride > 0
            ? setColumnOverride(local_columnOverride)
            : setColumnOverride(0);
        }
      };

      const savedWideUI = async () => {
        let saved_saveWideUI = await localForage.getItem("saveWideUI");
        if (saved_saveWideUI !== null) {
          saved_saveWideUI === false
            ? setSaveWideUI(false)
            : setSaveWideUI(true);
          localStorage.removeItem("saveWideUI");
        } else {
          fallback = true;
          let local_saveWideUI = localStorage.getItem("saveWideUI");
          local_saveWideUI?.includes("false")
            ? setSaveWideUI(false)
            : setSaveWideUI(true);
        }
      };

      const syncWideUI = async () => {
        let saved_syncWideUI = await localForage.getItem("syncWideUI");
        if (saved_syncWideUI !== null) {
          saved_syncWideUI === false
            ? setSyncWideUI(false)
            : setSyncWideUI(true);
          localStorage.removeItem("syncWideUI");
        } else {
          fallback = true;
          let local_syncWideUI = localStorage.getItem("syncWideUI");
          local_syncWideUI?.includes("false")
            ? setSyncWideUI(false)
            : setSyncWideUI(true);
        }
      };

      const postWideUI = async () => {
        let saved_postWideUI = await localForage.getItem("postWideUI");
        if (saved_postWideUI !== null) {
          saved_postWideUI === false
            ? setPostWideUI(false)
            : setPostWideUI(true);
          localStorage.removeItem("postWideUI");
        } else {
          fallback = true;
          let local_postWideUI = localStorage.getItem("postWideUI");
          local_postWideUI?.includes("false")
            ? setPostWideUI(false)
            : setPostWideUI(true);
        }
      };

      const loadWideUI = async () => {
        let saved_wideUI = await localForage.getItem("wideUI");
        if (saved_wideUI !== null) {
          saved_wideUI === false ? setWideUI(false) : setWideUI(true);
          localStorage.removeItem("wideUI");
        } else {
          fallback = true;
          let local_wideUI = localStorage.getItem("wideUI");
          local_wideUI?.includes("false") ? setWideUI(false) : setWideUI(true);
        }
      };

      const loadCardStyle = async () => {
        let saved_cardStyle: string = await localForage.getItem("cardStyle");
        if (saved_cardStyle !== null) {
          saved_cardStyle && setCardStyle(saved_cardStyle);
          localStorage.removeItem("cardStyle");
        } else {
          fallback = true;
          let local_cardStyle = localStorage.getItem("cardStyle");
          local_cardStyle?.length > 0
            ? setCardStyle(saved_cardStyle)
            : setCardStyle("default");
        }
      };

      const loadLocalSubs = async () => {
        let saved_localSubs: [] = await localForage.getItem("localSubs");
        if (saved_localSubs !== null) {
          saved_localSubs && setLocalSubs(saved_localSubs);
          localStorage.removeItem("localSubs");
        } else {
          fallback = true;
          let local_localSubs = JSON.parse(localStorage.getItem("localSubs"));
          local_localSubs && setLocalSubs(local_localSubs);
        }
      };

      const loadImgFilter = async () => {
        let saved_imgFilter = await localForage.getItem("imgFilter");
        if (saved_imgFilter !== null) {
          saved_imgFilter === false ? setImgFilter(false) : setImgFilter(true);
          localStorage.removeItem("imgFilter");
        } else {
          fallback = true;
          let local_imgFilter = localStorage.getItem("imgFilter");
          local_imgFilter?.includes("false")
            ? setImgFilter(false)
            : setImgFilter(true);
        }
      };
      const loadImgPortraitFilter = async () => {
        let saved_imgPortraitFilter = await localForage.getItem(
          "imgPortraitFilter"
        );
        if (saved_imgPortraitFilter !== null) {
          saved_imgPortraitFilter === false
            ? setImgPortraitFilter(false)
            : setImgPortraitFilter(true);
          localStorage.removeItem("imgPortraitFilter");
        } else {
          fallback = true;
          let local_imgPortraitFilter =
            localStorage.getItem("imgPortraitFilter");
          local_imgPortraitFilter?.includes("false")
            ? setImgPortraitFilter(false)
            : setImgPortraitFilter(true);
        }
      };

      const loadImgLandscapeFilter = async () => {
        let saved_imgLandscapeFilter = await localForage.getItem(
          "imgLandscapeFilter"
        );
        if (saved_imgLandscapeFilter !== null) {
          saved_imgLandscapeFilter === false
            ? setImgLandScapeFilter(false)
            : setImgLandScapeFilter(true);
          localStorage.removeItem("imgLandscapeFilter");
        } else {
          fallback = true;
          let local_imgLandscapeFilter =
            localStorage.getItem("imgLandscapeFilter");
          local_imgLandscapeFilter?.includes("false")
            ? setImgLandScapeFilter(false)
            : setImgLandScapeFilter(true);
        }
      };

      const loadVidFilter = async () => {
        let saved_vidFilter = await localForage.getItem("vidFilter");
        if (saved_vidFilter !== null) {
          saved_vidFilter === false ? setVidFilter(false) : setVidFilter(true);
          localStorage.removeItem("vidFilter");
        } else {
          fallback = true;
          let local_vidFilter = localStorage.getItem("vidFilter");
          local_vidFilter?.includes("false")
            ? setVidFilter(false)
            : setVidFilter(true);
        }
      };

      const loadLinkFilter = async () => {
        let saved_linkFilter = await localForage.getItem("linkFilter");
        if (saved_linkFilter !== null) {
          saved_linkFilter === false
            ? setLinkFilter(false)
            : setLinkFilter(true);
          localStorage.removeItem("linkFilter");
        } else {
          fallback = true;
          let local_linkFilter = localStorage.getItem("linkFilter");
          local_linkFilter?.includes("false")
            ? setLinkFilter(false)
            : setLinkFilter(true);
        }
      };

      const loadSelfFilter = async () => {
        let saved_selfFilter = await localForage.getItem("selfFilter");
        if (saved_selfFilter !== null) {
          saved_selfFilter === false
            ? setSelfFilter(false)
            : setSelfFilter(true);
          localStorage.removeItem("selfFilter");
        } else {
          fallback = true;
          let local_selfFilter = localStorage.getItem("selfFilter");
          local_selfFilter?.includes("false")
            ? setSelfFilter(false)
            : setSelfFilter(true);
        }
      };

      const loadReadFilter = async () => {
        let saved_readFilter = await localForage.getItem("readFilter");
        if (saved_readFilter !== null) {
          saved_readFilter === false
            ? setReadFilter(false)
            : setReadFilter(true);
          localStorage.removeItem("readFilter");
        } else {
          fallback = true;
          let local_readFilter = localStorage.getItem("readFilter");
          local_readFilter?.includes("false")
            ? setReadFilter(false)
            : setReadFilter(true);
        }
      };

      //new settings don't need localstorage fallback..
      const loadCollapseChildrenOnly = async () => {
        let saved_collapseChildrenOnly = await localForage.getItem(
          "collapseChildrenOnly"
        );
        saved_collapseChildrenOnly === true
          ? setCollapseChildrenOnly(true)
          : setCollapseChildrenOnly(false);
      };
      const loadDefaultCollapseChildren = async () => {
        let saved_defaultCollapseChildren = await localForage.getItem(
          "defaultCollapseChildren"
        );
        saved_defaultCollapseChildren === true
          ? setDefaultCollapseChildren(true)
          : setDefaultCollapseChildren(false);
      };
      const loadShowUserIcons = async () => {
        let saved_loadShowUserIcons = await localForage.getItem(
          "showUserIcons"
        );
        saved_loadShowUserIcons === false
          ? setShowUserIcons(false)
          : setShowUserIcons(true);
      };
      const loadShowAwardings = async () => {
        let saved_showAwardings = await localForage.getItem("showAwardings");
        saved_showAwardings === false
          ? setShowAwardings(false)
          : setShowAwardings(true);
      };
      const loadShowFlairs = async () => {
        let saved_showFlairs = await localForage.getItem("showFlairs");
        saved_showFlairs === false ? setShowFlairs(false) : setShowFlairs(true);
      };
      const loadShowUserFlairs = async () => {
        let saved_showUserFlairs = await localForage.getItem("showUserFlairs");
        saved_showUserFlairs === false
          ? setShowUserFlairs(false)
          : setShowUserFlairs(true);
      };
      const loadExpandedSubPane = async () => {
        let saved = await localForage.getItem("expandedSubPane");
        saved === true ? setExpandedSubPane(true) : setExpandedSubPane(false);
      };
      const loadInfiniteLoading = async() => {
        let saved = await localForage.getItem("infiniteLoading");
        saved === false ? setInfinitLoading(false) : setInfinitLoading(true); 
      }
      const loadDimRead = async() => {
        let saved = await localForage.getItem("dimRead");
        saved === false ? setDimRead(false) : setDimRead(true); 
      }
      const loadAutoRead = async() => {
        let saved = await localForage.getItem("autoRead");
        saved === false ? setAutoRead(false) : setAutoRead(true); 
      }
      const loadDisableEmbeds = async() => {
        let saved = await localForage.getItem("disableEmbeds");
        saved === true ? setDisableEmbeds(true) : setDisableEmbeds(false); 
      }
      const loadPreferEmbeds = async() => {
        let saved = await localForage.getItem("preferEmbeds");
        saved === true ? setPreferEmbeds(true) : setPreferEmbeds(false); 
      }
      const loadEmbedsEverywhere = async() => {
        let saved = await localForage.getItem("embedsEverywhere");
        saved === true ? setEmbedsEveryWhere(true) : setEmbedsEveryWhere(false); 
      }

      //things we dont' really need loaded before posts are loaded
      loadCollapseChildrenOnly();
      loadDefaultCollapseChildren();
      loadShowUserIcons();
      loadShowUserFlairs();
      loadExpandedSubPane();
      loadAutoRead(); 

      //things we need loaded before posts are rendered
      let nsfw = loadNSFW();
      let autoplay = loadAutoplay();
      let hoverplay = loadHoverPlay();
      let mediaonly = loadMediaOnly();
      let audiohover = audioOnHover();
      let columnoverride = columnOverride();
      let savewideui = savedWideUI();
      let syncwideui = syncWideUI();
      let postwideui = postWideUI();
      let wideUI = loadWideUI();
      let cardstyle = loadCardStyle();
      let localsubs = loadLocalSubs();
      let imgfilter = loadImgFilter();
      let imgportraitfilter = loadImgPortraitFilter();
      let imglandscapefilter = loadImgLandscapeFilter();
      let vidfilter = loadVidFilter();
      let linkfilter = loadLinkFilter();
      let selffilter = loadSelfFilter();
      let readfilter = loadReadFilter();
      let showflairs = loadShowFlairs();
      let showawardings = loadShowAwardings();
      let infiniteLoading = loadInfiniteLoading(); 
      let dimread = loadDimRead(); 
      let disableembeds = loadDisableEmbeds(); 
      let preferembeds = loadPreferEmbeds(); 
      let loadembedseverywhere = loadEmbedsEverywhere(); 
      await Promise.all([
        nsfw,
        autoplay,
        hoverplay,
        mediaonly,
        audiohover,
        columnoverride,
        savewideui,
        syncwideui,
        postwideui,
        wideUI,
        cardstyle,
        localsubs,
        imgfilter,
        imgportraitfilter,
        imglandscapefilter,
        vidfilter,
        linkfilter,
        selffilter,
        readfilter,
        showflairs,
        showawardings,
        infiniteLoading,
        dimread,
        disableembeds, 
        preferembeds, 
        loadembedseverywhere
      ]);

      //Not doing this as all read posts shoudn't be loaded into memory. Instead read posts are loaded into memory as needed in PostOptButton component or in filter in utils
      // let saved_readPosts = await localForage.getItem("readPosts");
      // if (saved_readPosts !== null) {
      //   //saved_readPosts && setReadPosts(saved_readPosts);
      //   localStorage.removeItem("readPosts");
      // }
      setReady(true);
    };

    getSettings();
  }, []);
  useEffect(() => {
    if (disableEmbeds !== undefined) {
      localForage.setItem("disableEmbeds", disableEmbeds);
    }
  }, [disableEmbeds]);
  useEffect(() => {
    if (preferEmbeds !== undefined) {
      localForage.setItem("preferEmbeds", preferEmbeds);
    }
  }, [preferEmbeds]);
  useEffect(() => {
    if (embedsEverywhere !== undefined) {
      localForage.setItem("embedsEverywhere", embedsEverywhere);
    }
  }, [embedsEverywhere]);
  useEffect(() => {
    if (autoRead !== undefined) {
      localForage.setItem("autoRead", autoRead);
    }
  }, [autoRead]);
  useEffect(() => {
    if (dimRead !== undefined) {
      localForage.setItem("dimRead", dimRead);
    }
  }, [dimRead]);
  useEffect(() => {
    if (infiniteLoading !== undefined) {
      localForage.setItem("infiniteLoading", infiniteLoading);
    }
  }, [infiniteLoading]);
  useEffect(() => {
    if (expandedSubPane !== undefined) {
      localForage.setItem("expandedSubPane", expandedSubPane);
    }
  }, [expandedSubPane]);
  useEffect(() => {
    if (showUserFlairs !== undefined) {
      localForage.setItem("showUserFlairs", showUserFlairs);
    }
  }, [showUserFlairs]);
  useEffect(() => {
    if (showFlairs !== undefined) {
      localForage.setItem("showFlairs", showFlairs);
    }
  }, [showFlairs]);
  useEffect(() => {
    if (showAwardings !== undefined) {
      localForage.setItem("showAwardings", showAwardings);
    }
  }, [showAwardings]);
  useEffect(() => {
    if (showUserIcons !== undefined) {
      localForage.setItem("showUserIcons", showUserIcons);
    }
  }, [showUserIcons]);
  useEffect(() => {
    if (defaultCollapseChildren !== undefined) {
      localForage.setItem("defaultCollapseChildren", defaultCollapseChildren);
    }
  }, [defaultCollapseChildren]);
  useEffect(() => {
    if (collapseChildrenOnly !== undefined) {
      localForage.setItem("collapseChildrenOnly", collapseChildrenOnly);
    }
  }, [collapseChildrenOnly]);
  useEffect(() => {
    if (readFilter !== undefined) {
      localForage.setItem("readFilter", readFilter);
    }
  }, [readFilter]);
  useEffect(() => {
    if (imgFilter !== undefined) {
      localForage.setItem("imgFilter", imgFilter);
    }
  }, [imgFilter]);
  useEffect(() => {
    if (imgPortraitFilter !== undefined) {
      localForage.setItem("imgPortraitFilter", imgPortraitFilter);
    }
  }, [imgPortraitFilter]);
  useEffect(() => {
    if (imgLandscapeFilter !== undefined) {
      localForage.setItem("imgLandscapeFilter", imgLandscapeFilter);
    }
  }, [imgLandscapeFilter]);
  useEffect(() => {
    if (vidFilter !== undefined) {
      localForage.setItem("vidFilter", vidFilter);
    }
  }, [vidFilter]);
  useEffect(() => {
    if (linkFilter !== undefined) {
      localForage.setItem("linkFilter", linkFilter);
    }
  }, [linkFilter]);
  useEffect(() => {
    if (selfFilter !== undefined) {
      localForage.setItem("selfFilter", selfFilter);
    }
  }, [selfFilter]);

  useEffect(() => {
    if (localSubs?.length > 0) {
      let encoded = encodeURIComponent(localSubs.join(","));
      //if we can fit this in the cookie
      if (encoded.length < 4000) {
        document.cookie = `localSubs=${encoded};samesite=strict;path=/`;
      }
      //otherwise fallback and will have to use indexed DB
      else {
        document.cookie = `localSubs=${true};samesite=strict`;
      }
      localForage.setItem("localSubs", localSubs);
    } else {
      document.cookie = `localSubs=false;samesite=strict`;
    }
  }, [localSubs]);

  useEffect(() => {
    if (nsfw !== undefined) {
      localForage.setItem("nsfw", nsfw);
    }
  }, [nsfw]);
  useEffect(() => {
    if (autoplay !== undefined) {
      localForage.setItem("autoplay", autoplay);
    }
  }, [autoplay]);
  useEffect(() => {
    if (hoverplay !== undefined) {
      localForage.setItem("hoverplay", hoverplay);
    }
  }, [hoverplay]);
  useEffect(() => {
    if (columnOverride !== undefined) {
      localForage.setItem("columnOverride", columnOverride);
    }
  }, [columnOverride]);
  useEffect(() => {
    if (saveWideUI !== undefined) {
      localForage.setItem("saveWideUI", saveWideUI);
    }
  }, [saveWideUI]);
  useEffect(() => {
    if (syncWideUI !== undefined) {
      localForage.setItem("syncWideUI", syncWideUI);
    }
  }, [syncWideUI]);
  useEffect(() => {
    if (postWideUI !== undefined) {
      localForage.setItem("postWideUI", postWideUI);
    }
  }, [postWideUI]);
  useEffect(() => {
    if (wideUI !== undefined) {
      localForage.setItem("wideUI", wideUI);
    }
  }, [wideUI]);
  useEffect(() => {
    if (mediaOnly !== undefined) {
      localForage.setItem("mediaOnly", mediaOnly);
    }
  }, [mediaOnly]);
  useEffect(() => {
    if (cardStyle?.length > 0) {
      localForage.setItem("cardStyle", cardStyle);
    }
  }, [cardStyle]);
  useEffect(() => {
    if (audioOnHover !== undefined) {
      localForage.setItem("audioOnHover", audioOnHover);
    }
  }, [audioOnHover]);

  return (
    <MainContext.Provider
      value={{
        nsfw,
        toggleNSFW,
        loginModal,
        toggleLoginModal,
        setLoginModal,
        autoplay,
        toggleAutoplay,
        hoverplay,
        toggleHoverPlay,
        columns,
        setColumns,
        wideUI,
        syncWideUI,
        postWideUI,
        setPostWideUI,
        setSyncWideUI,
        toggleSyncWideUI,
        togglePostWideUI,
        saveWideUI,
        toggleWideUI,
        setWideUI,
        columnOverride,
        setColumnOverride,
        mediaOnly,
        setMediaOnly,
        toggleMediaOnly,
        pauseAll,
        setPauseAll,
        audioOnHover,
        toggleAudioOnHover,
        cardStyle,
        setCardStyle,
        posts,
        setPosts,
        gAfter,
        setGAfter,
        postNum,
        setPostNum,
        localSubs,
        subToSub,
        token,
        setToken,
        updateLikes,
        updateSaves,
        updateHidden,
        forceRefresh,
        setForceRefresh,
        fastRefresh,
        setFastRefresh,
        ready,
        loading,
        setLoading,
        toggleFilter,
        readFilter,
        imgFilter,
        vidFilter,
        galFilter,
        linkFilter,
        selfFilter,
        imgResExactFilter,
        imgResFilter,
        imgLandscapeFilter,
        imgPortraitFilter,
        imgResXFilter,
        imgResYFilter,
        scoreFilter,
        scoreGreater,
        scoreFilterNum,
        replyFocus,
        setReplyFocus,
        userPostType,
        toggleUserPostType,
        readPosts,
        readPostsChange, 
        addReadPost,
        toggleReadPost,
        postOpen,
        setPostOpen,
        collapseChildrenOnly,
        toggleCollapseChildrenOnly,
        defaultCollapseChildren,
        toggleDefaultCollapseChildren,
        showUserIcons,
        toggleShowUserIcons,
        showAwardings,
        toggleShowAwardings,
        showFlairs,
        toggleShowFlairs,
        showUserFlairs,
        toggleShowUserFlairs,
        expandedSubPane,
        toggleExpandedSubPane,
        infiniteLoading, 
        toggleInfiniteLoading,
        dimRead, 
        toggleDimRead, 
        autoRead, 
        toggleAutoRead,
        disableEmbeds, 
        toggleDisableEmbeds, 
        preferEmbeds, 
        togglePreferEmbeds, 
        embedsEverywhere, 
        toggleEmbedsEverywhere,
        updateFilters, 
        setUpdateFilters,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
