export default [
  // {
  //   url: "/",
  //   name: "Home",
  //   slug: "home",
  //   icon: "HomeIcon",
  // },
  /*{
    url: "/unos-naloga",
    name: "Unos radnog naloga",
    slug: "unos radnog naloga",
    icon: "Edit3Icon",
  },*/
  {
    url: "/",
    name: "Kalendar",
    slug: "kalendar",
    icon: "CalendarIcon",
  },
  {
    url: "/nalozi/pregled",
    name: "Pregled svih naloga",
    slug: "Pregled svih naloga",
    icon: "ClipboardIcon"
  },
  {
    url: null,
    name: "Narudžbe",
    icon: "LayersIcon",
      requiresAdmin: true,
    submenu: [
      {
        url: "/narudzbe/nova",
        name: "Unos nove narudžbe",
        slug: "unos nove narudzbe",
      },
      {
        url: "/narudzbe/pregled",
        name: "Sve narudžbe",
        slug: "pregled svih narudzbi",
      },
    ]
  },
    {
        url: null,
        name: "Isporuke",
        icon: "SendIcon",
        requiresAdmin: true,
        submenu: [
            {
                url: "/isporuke/nova",
                name: "Unos nove isporuke",
                slug: "unos nove isporuke",
                icon: "FileIcon",
            },
            {
                url: "/isporuke/pregled",
                name: "Pregled svih isporuka",
                slug: "pregled svih isporuka",
                icon: "FileIcon",
            },
        ]
    },
    {
        url: null,
        name: "Reklamacije",
        icon: "CornerDownLeftIcon",
        submenu: [
            {
                url: "/reklamacije/nova",
                name: "Unos nove reklamacije",
                slug: "unos nove reklamacije",
            },
            {
                url: "/reklamacije/pregled",
                name: "Sve reklamacije",
                slug: "pregled svih reklamacija",
            },
            {
                url: "/povratnice/pregled",
                name: "Sve povratnice",
                slug: "pregled svih povratnica",
            },
        ]
    },
  {
    url: null,
    name: "Pozicije",
    icon: "SlidersIcon",
      requiresAdmin: true,
    submenu:[
      {
        url: "/pozicije/nova",
        name: "Unos nove pozicije",
        slug: "unos nove pozicije",
      },
      {
        url: "/pozicije/pregled",
        name: "Sve pozicije",
        slug: "pregled svih pozicija",
      },
    ]
  },
  {
    url: null,
    name: "Materijali",
    icon: "FileIcon",
      requiresAdmin: true,
    submenu: [
      {
        url: "/materijali/novi",
        name: "Unos novog materijala",
        slug: "unos novog materijala",
        icon: "FileIcon",
      },
      {
        url: "/materijali/pregled",
        name: "Svi materijali",
        slug: "pregled svih materijala",
        icon: "FileIcon",
      },
    ]
  },
  {
    url: null,
    name: "Kooperanti",
    icon: "BriefcaseIcon",
      requiresAdmin: true,
    submenu: [
      {
        url: "/kooperanti/novi",
        name: "Novi kooperant",
        slug: "novi kooperant",
      },
      {
        url: "/kooperanti/pregled",
        name: "Pregled kooperanta",
        slug: "pregled kooperanta",
      },
    ]
  },
    {
        url: null,
        name: "Zaposlenici",
        icon: "UsersIcon",
        requiresAdmin: true,
        submenu: [
            {
              url: "/zaposlenici/dodaj",
              name: "Dodaj zasposlenika",
              slug: "dodaj zaposlenika",
            },
            {
                url: "/zaposlenici/pregled",
                name: "Popis zaposlenika",
                slug: "popis zaposlenika",
            },
            {
                url: "/zaposlenici/barkodovi",
                name: "Barkodovi zaposlenika",
                slug: "barkodovi zaposlenika",
            },
            {
                url: "/zaposlenici/nedovrsene-operacije",
                name: "Nedovršene operacije",
                slug: "nedovrsene operacije",
            },
        ]
    },
    {
        url: null,
        name: "Strojevi",
        icon: "ZapIcon",
        requiresAdmin: true,
        submenu: [
            {
              url: "/strojevi/dodaj",
              name: "Dodaj stroj",
              slug: "dodaj stroj",
            },
            {
                url: "/strojevi/pregled",
                name: "Popis strojeva",
                slug: "pregled strojeva",
            },
            {
                url: "/strojevi/barkodovi",
                name: "Barkodovi strojeva",
                slug: "barkodovi strojeva",
            },
        ]
    },
    {
        url: "/cijene",
        name: "Cijene",
        slug: "cijene",
        icon: "PocketIcon",
        requiresAdmin: true,
    },
    {
        url: "/kontakt_forma",
        name: "Kontakt forma",
        slug: "Kontakt Forma",
        icon: "MessageCircleIcon",
        requiresAdmin: true,
    },
    {
        url: "/changelog",
        name: "Changelog",
        slug: "changelog",
        icon: "HelpCircleIcon",
        requiresAdmin: true,
    }
]
