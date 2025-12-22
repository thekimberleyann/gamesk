/**
 * Korn Wordle List
 * Author: Kimberley Gonzalez
 * Created: December 2025
 * Current Task: Updated with album cover
 * Last Updated: December 2025 - Added new 5-letter words
 */

export const fiveLetter = [
    //KORN (1994)
    { word: "BLIND", category: "song_title", album: "Korn", year: 1994, difficulty: "easy", hint: "Opening track from the debut album", albumCover: "/albums/korn.jpg" },
    { word: "CLOWN", category: "song_title", album: "Korn", year: 1994, difficulty: "easy", hint: "Fourth track from their self-titled debut", albumCover: "/albums/korn.jpg" },
    { word: "FAGET", category: "song_title", album: "Korn", year: 1994, difficulty: "medium", hint: "Controversial track about bullying from the debut", albumCover: "/albums/korn.jpg" },
    { word: "DADDY", category: "song_title", album: "Korn", year: 1994, difficulty: "easy", hint: "Emotional 17-minute closing track from the debut", albumCover: "/albums/korn.jpg" },
    
    //LIFE IS PEACHY (1996)
    { word: "TWIST", category: "song_title", album: "Life Is Peachy", year: 1996, difficulty: "easy", hint: "49-second opening track from their second album", albumCover: "/albums/life-is-peachy.jpg" },
    
    //FOLLOW THE LEADER (1998)
    { word: "FREAK", category: "song_title", album: "Follow the Leader", year: 1998, difficulty: "easy", hint: "Part of their biggest hit '_____ on a Leash'", albumCover: "/albums/follow-the-leader.jpg" },
    { word: "SEEDS", category: "song_title", album: "Follow the Leader", year: 1998, difficulty: "medium", hint: "Track 11 from Follow the Leader", albumCover: "/albums/follow-the-leader.jpg" },
    
    //ISSUES (1999)
    { word: "TRASH", category: "song_title", album: "Issues", year: 1999, difficulty: "easy", hint: "Third track from the Issues album", albumCover: "/albums/issues.jpg" },
    { word: "DIRTY", category: "song_title", album: "Issues", year: 1999, difficulty: "medium", hint: "Closing track from Issues", albumCover: "/albums/issues.jpg" },
    
    //UNTOUCHABLES (2002)
    { word: "BLAME", category: "song_title", album: "Untouchables", year: 2002, difficulty: "easy", hint: "Third track from Untouchables", albumCover: "/albums/untouchables.jpg" },
    { word: "ALONE", category: "song_title", album: "Untouchables", year: 2002, difficulty: "medium", hint: "From '_____ I Break' on Untouchables", albumCover: "/albums/untouchables.jpg" },
    
    //TAKE A LOOK IN THE MIRROR (2003)
    { word: "ALIVE", category: "song_title", album: "Take a Look in the Mirror", year: 2003, difficulty: "easy", hint: "Track 9 from Take a Look in the Mirror", albumCover: "/albums/take-a-look-in-the-mirror.jpg" },
    
    // MTV UNPLUGGED (2007)
    { word: "CREEP", category: "song_title", album: "MTV Unplugged", year: 2007, difficulty: "medium", hint: "Radiohead cover from MTV Unplugged", albumCover: "/albums/mtv-unplugged.jpg" },
    
    // THE PATH OF TOTALITY (2011)
    { word: "CHAOS", category: "song_title", album: "The Path of Totality", year: 2011, difficulty: "medium", hint: "From '_____ Lives in Everything' - dubstep era", albumCover: "/albums/the-path-of-totality.jpg" },
    
    // THE PARADIGM SHIFT (2013)
    { word: "SPIKE", category: "song_title", album: "The Paradigm Shift", year: 2013, difficulty: "medium", hint: "From '_____ in My Veins' - Head's return album", albumCover: "/albums/the-paradigm-shift.jpg" },
    { word: "HATER", category: "song_title", album: "The Paradigm Shift", year: 2013, difficulty: "hard", hint: "Bonus track from The Paradigm Shift deluxe edition", albumCover: "/albums/the-paradigm-shift.jpg" },
    { word: "NEVER", category: "song_title", album: "The Paradigm Shift", year: 2013, difficulty: "medium", hint: "From '_____ Never' - lead single from Head's return", albumCover: "/albums/the-paradigm-shift.jpg" },
    
    //THE SERENITY OF SUFFERING
    { word: "VENOM", category: "song_title", album: "The Serenity of Suffering", year: 2016, difficulty: "medium", hint: "From 'Black Is the Soul' era", albumCover: "/albums/the-serenity-of-suffering.jpg" },
    
    //THE NOTHING (2019)
    { word: "DEATH", category: "song_title", album: "The Nothing", year: 2019, difficulty: "medium", hint: "Theme throughout The Nothing album", albumCover: "/albums/the-nothing.jpg" },
    
    // === ALBUM-RELATED ===
    { word: "SHIFT", category: "album", album: "The Paradigm Shift", year: 2013, difficulty: "medium", hint: "The Paradigm _____", albumCover: "/albums/the-paradigm-shift.jpg" },
    { word: "PEACE", category: "album", album: "Life Is Peachy", year: 1996, difficulty: "medium", hint: "Life Is _____y (close enough!)", albumCover: "/albums/life-is-peachy.jpg" },
    { word: "TOTAL", category: "album", album: "The Path of Totality", year: 2011, difficulty: "medium", hint: "The Path of _____ity", albumCover: "/albums/the-path-of-totality.jpg" },
    
];