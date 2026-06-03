/*
* Site Security Box Favicons (a mod for Vivaldi)
* Written by LonM
* No Copyright Reserved
* This mod takes the favicon from a tab and places it into the address bar site info box
* Assumes presence of both the tab bar and the address bar
*/

(function faviconSecurity(){
    "use strict";

    // Constant CSS Selectors
    const SECURITY_ZONE_ICON = ".SiteInfoButton button .button-icon svg";
    const SECURITY_ZONE_FAVICON = ".SiteInfoButton button .button-icon img";
    const SECURITY_ZONE = ".SiteInfoButton button .button-icon";

    // Clone the favicon and add a copy to the security zone
    // also style it appropriately
    function clone_favicon_and_add_to_security(activetab){
        // make sure everything we need to access exists
        const sz_icon = document.querySelector(SECURITY_ZONE_ICON);
        const siteinfo = document.querySelector(SECURITY_ZONE);
        const sz_favicon = document.querySelector(SECURITY_ZONE_FAVICON);
        if(!sz_icon || !siteinfo){return;}
        // reset favicon (e.g. if navigating to internal page)
        if(sz_favicon){
            sz_favicon.style.display = 'none';
        }
        // don't operate on internala pages
        if(activetab.url.indexOf('chrome') === 0 || activetab.url.indexOf('vivaldi') === 0){return;}
        // create or update existing favicon
        if(!sz_favicon){
            const newfavicon = document.createElement('img');
            newfavicon.style.width = "16px";
            newfavicon.style.height = "16px";
            newfavicon.style.display = "block";
            newfavicon.style.margin = "3px";
            newfavicon.style.backgroundSize = "contain";
            newfavicon.src = 'chrome://favicon/size/16/' + activetab.url;
            sz_icon.parentNode.insertBefore(newfavicon, sz_icon);
        } else {
            sz_favicon.src = 'chrome://favicon/size/16/' + activetab.url;
            sz_favicon.style.display = 'block';
        }
    }


    // The tab was changed, so favicon needs changing. only change for current window
    chrome.tabs.onActivated.addListener(activeInfo => {
        vivaldi.windowPrivate.getCurrentId(id => {
            if(activeInfo.windowId === id){
                chrome.tabs.get(activeInfo.tabId).then(clone_favicon_and_add_to_security)
            }
        });
    });
    // The tab loaded somewhere new, so favicon needs updating
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if(tab.active === true && (changeInfo.faviconUrl || changeInfo.status)) {
            clone_favicon_and_add_to_security(tab);
        }
    });

})();


