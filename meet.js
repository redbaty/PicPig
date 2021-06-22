const listaPorquinhos = [
    'benedito.jpg',
    'carlota.png',
    'cristofes.jpg',
    'dirceu.jpg',
    'ellen.jpg',
    'helena.jpg',
    'jorel.jpg',
    'jorge.jpg',
    'jose.jpg',
    'julia.png',
    'leo_e_renato.jpg',
    'marbs.jpg',
    'maria_clara.jpg',
    'pedro.jpg',
    'sileide.jpg',
    'thcuca.jpg',
    'wood.jpg'
];

const dict = {};

function xp(path) {
    var r = [];
    var x = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);

    var item = x.iterateNext();
    while (item) {
        r.push(item);
        item = x.iterateNext();
    }

    return r;
}

function getAttributeFromParents(node, attribute, limit) {
    let parent = node.parentNode;
    let currentCount = 0;

    while (parent && currentCount < limit) {
        const id = node.getAttribute(attribute);
        if (id) {
            return id;
        }

        parent = node.parentNode;
        currentCount++;
    }

    return undefined;
}


const observer = new MutationObserver(() => {
    const mainImages = xp('//div[@data-requested-participant-id]//img');
    for (const f of mainImages) {
        const userId = f.parentNode?.parentNode?.parentNode?.parentNode?.getAttribute("data-requested-participant-id");

        if (userId) {
            if (!dict[userId]) {
                dict[userId] = chrome.runtime.getURL(`porquinhos/${listaPorquinhos[Math.floor(Math.random() * listaPorquinhos.length)]}`);
            }

            if (f.src !== dict[userId]) {
                f.src = dict[userId];
                f.style["object-fit"] = 'cover';
            }
        }
    }

    const sidebarImages = xp("//div[@data-participant-id]//img");
    for (const f of sidebarImages) {
        const userId = f.parentNode?.parentNode?.getAttribute("data-participant-id");

        if (userId) {
            console.log(f);

            if (!dict[userId]) {
                dict[userId] = chrome.runtime.getURL(`porquinhos/${listaPorquinhos[Math.floor(Math.random() * listaPorquinhos.length)]}`);
            }

            if (f.src !== dict[userId]) {
                f.src = dict[userId];
                f.style.width = '32px';
                f.style["object-fit"] = 'cover';
            }
        }
    }

    const mainNameTags = xp("//div[@data-self-name]");
    for (const f of mainNameTags) {
        if (!f.innerText.includes("BACON"))
            f.innerText += " BACON";
    }
});
const config = { attributes: true, childList: true, subtree: true };

observer.observe(document, config)