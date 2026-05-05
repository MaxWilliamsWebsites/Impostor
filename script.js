const width = window.innerWidth;
const height = window.innerHeight;

const ar = width/height;
if (ar > 1.0)
{
    alert("This game is design to word in portait mode and may not work properly in landscape mode. Please rotate your device for the best experience.");
}

// IMPORTANT
let ImposterCount = 1;
let players = [];
let imposterButtons = [];

let selectedCategoryName = ""
let selectedWord = ""
let selectedHint = ""
let impostors = [];

let viewingPlayer = 0;

const ClassicButton = document.getElementById("ClassicButton");
const OnlineButton = document.getElementById("OnlineButton");

ClassicButton.addEventListener("click", () => {
    ClassicButton.classList.remove("inactive");
    OnlineButton.classList.add("inactive");
});
OnlineButton.addEventListener("click", () => {
    OnlineButton.classList.remove("inactive");
    ClassicButton.classList.add("inactive");
});

const PlayersWindow = document.getElementById("PlayersWindow");
const PlayerManageWindow = document.getElementById("PlayerManageWindow");
const PlayerManagePopup = document.getElementById("PlayerManagePopup");
const ConfirmPlayersButton = document.getElementById("ConfirmPlayersButton");
PlayersWindow.addEventListener("click", () => {
    PlayerManageWindow.classList.remove("inactive");
});
PlayerManageWindow.addEventListener("click", () => {
    PlayerManageWindow.classList.add("inactive");
});
PlayerManagePopup.addEventListener("click", (e) => {
    e.stopPropagation();
});

class Player
{
    constructor(name, index) {
        this.name = name;
        this.index = index;
        this.imposter = false;
    }
}

const PlayerInputButton = document.getElementById("PlayerInputButton");
const PlayerInputField = document.getElementById("PlayerInputField");
const PlayerManageMiddle = document.getElementById("PlayerManageMiddle");
const PlayerIconContainer = document.getElementById("PlayerIconContainer");
PlayerInputButton.addEventListener("click", (e) => {

    const text = PlayerInputField.value;
    if (text.length < 3 || text.length > 30)
    {
        PlayerInputField.value = "";
        alert("Names must be within 3-30 characters!");
        return;
    }

    AddPlayer(text);
    PlayerInputField.value = "";
});

ConfirmPlayersButton.addEventListener("click", () => {
    PlayerManageWindow.classList.add("inactive");
    PlayerInputField.value = "";
});

function AddPlayer(text)
{
    const p = new Player(text, players.length);
    players.push(p);

    // ICON

    const icon = AddIcon(PlayerIconContainer, text)

    // INPUT

    let container = document.createElement("div");
    container.classList.add("player-container");

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.minLength = 3;
    textInput.maxLength = 30;
    textInput.value = text;
    textInput.lastValue = text;
    textInput.classList.add("player-text-element");

    const deleteIcon = document.createElement("div");
    deleteIcon.classList.add("player-delete-icon")

    const deleteText = document.createElement("h1");
    deleteText.classList.add("player-delete-text");
    deleteText.textContent = "+";
    deleteIcon.appendChild(deleteText);

    container.appendChild(textInput);
    container.appendChild(deleteIcon);

    textInput.addEventListener("click", () => {
        textInput.focus();
    });
    textInput.addEventListener("input", () => {

        textInput.lastValue = textInput.value;
        p.name = textInput.value;
    });
    
    deleteIcon.addEventListener("click", () => {

        if (players.length <= 3)
        {
            alert("Cannot have less than 3 players!");
            return;
        }

        PlayerManageMiddle.removeChild(container);
        PlayerIconContainer.removeChild(icon);
        players.splice(p.index, 1);

        for (let i = p.index; i < players.length; i++)
        {
            players[i].index-=1;
        }

        BuildImposterButtons();
    });

    PlayerManageMiddle.appendChild(container);
    BuildImposterButtons();
}

function AddIcon(container, text)
{
    const IconContainer = document.createElement("div");
    IconContainer.classList.add("player-icon-container")

    const IconText = document.createElement("p");
    IconText.classList.add("player-icon-text");
    IconText.textContent = text;

    IconContainer.appendChild(IconText);
    container.appendChild(IconContainer);

    return IconContainer;
}

AddPlayer("Player1");
AddPlayer("Player2");
AddPlayer("Player3");

// IMPOSTERS

const ImpostersWindow = document.getElementById("ImpostersWindow");
const ImpostersManageWindow = document.getElementById("ImpostersManageWindow");
const ImpostersManagePopup = document.getElementById("ImpostersManagePopup");
const ConfirmImpostorsButton = document.getElementById("ConfirmImpostorsButton");
ImpostersManageWindow.addEventListener("click", () => {
    ImpostersManageWindow.classList.add("inactive")
});
ImpostersWindow.addEventListener("click", () => {
    ImpostersManageWindow.classList.remove("inactive");
});
ImpostersManagePopup.addEventListener("click", (e) => {
    e.stopPropagation();
});
ConfirmImpostorsButton.addEventListener("click", () => {
    ImpostersManageWindow.classList.add("inactive");
});

function newImposterButton(count)
{
    const Imposters = document.getElementById("Imposters");
    const ImpostersText = document.getElementById("ImpostersText");

    const container = document.createElement("div");
    container.classList.add("imposter-container");

    const text = document.createElement("h1");
    text.classList.add("imposter-container-text");
    text.textContent = count + " Imposter" + (count > 1 ? "s" : "");
    container.appendChild(text);
    Imposters.appendChild(container);

    imposterButtons.push(container);

    container.addEventListener("click", () => {
        ImposterCount = count;
        const ImposterCountText = document.getElementById("ImposterCountText");
        ImposterCountText.textContent = ImposterCount + " Imposter" + ((ImposterCount > 1) ? "s" : "");
        for (let i = 0; i < imposterButtons.length; i++)
        {
            if (i == count-1)
            {
                imposterButtons[i].classList.add("selected");
            }
            else
            {
                imposterButtons[i].classList.remove("selected");
            }
        }
    });

    return container;
}

function BuildImposterButtons(firstImposter = false)
{
    const Imposters = document.getElementById("Imposters");
    const ImpostersText = document.getElementById("ImpostersText");

    Imposters.innerHTML = "";
    imposterButtons = [];
    if (players.length <= 5 || firstImposter)
    {
        ImpostersText.textContent = "with 3-5 players you can have 1 Imposter.";
        const one = newImposterButton(1);
    }
    if (players.length > 5 && players.length <= 7)
    {
        ImpostersText.textContent = "with 6-7 players you can have 2 Imposters.";
        const one = newImposterButton(1);
        const two = newImposterButton(2);
    }
    if (players.length > 7)
    {
        ImpostersText.textContent = "with 8+ players you can have 3 Imposters.";
        const one = newImposterButton(1);
        const two = newImposterButton(2);
        const three = newImposterButton(3);
    }
    if (players.length > 10)
    {
        ImpostersText.textContent = "with 10+ players you can have 4 Imposters.";
        const one = newImposterButton(1);
        const two = newImposterButton(2);
        const three = newImposterButton(3);
        const four = newImposterButton(4);
    }
    if (players.length > 13)
    {
        ImpostersText.textContent = "with 14+ players you can have 5 Imposters.";
        const one = newImposterButton(1);
        const two = newImposterButton(2);
        const three = newImposterButton(3);
        const four = newImposterButton(4);
        const five = newImposterButton(5);
    }

    imposterButtons[ImposterCount - 1].click();
}

BuildImposterButtons(true);

// CATEGORIES

const CategoryWindow = document.getElementById("CategoryWindow");
const CategoryManageWindow = document.getElementById("CategoryManageWindow");
const CategoryManagePopup = document.getElementById("CategoryManagePopup");
const ConfirmCategoriesButton = document.getElementById("ConfirmCategoriesButton")

CategoryWindow.addEventListener("click", () => {
    CategoryManageWindow.classList.remove("inactive")
});
CategoryManageWindow.addEventListener("click", () => {
    CategoryManageWindow.classList.add("inactive");
});
CategoryManagePopup.addEventListener("click", (e) => {
    e.stopPropagation();
});
ConfirmCategoriesButton.addEventListener("click", () => {
    CategoryManageWindow.classList.add("inactive");
});

class Category
{
    constructor(name, definitions)
    {
        this.name = name;
        this.definitions = definitions;
    }
}

class CategoryDefinition
{
    constructor(word, hints)
    {
        this.word = word;
        this.hints = hints;
    }
}

selectedCategories = []

const Categories = document.getElementById("Categories");
const CategoryIconContainer = document.getElementById("CategoryIconContainer");
function AddCategoryButton(category, onByDefault = false)
{
    const container = document.createElement("div");
    container.classList.add("category");

    const text = document.createElement("p");
    text.classList.add("category-text");
    text.textContent = category.name;

    container.appendChild(text);
    container.clicked = false;
    Categories.appendChild(container);

    const icon = AddIcon(CategoryIconContainer, category.name);
    icon.classList.add("hidden");

    container.addEventListener("click", () => {
        container.clicked = !container.clicked;
        if (container.clicked)
        {
            container.classList.add("selected");
            selectedCategories.push(category);
            icon.classList.remove("hidden");
        }
        else
        {
            container.classList.remove("selected");
            selectedCategories.splice(selectedCategories.indexOf(category), 1);
            icon.classList.add("hidden");
        }
    });

    if (onByDefault)
    {
        container.click();
    }
}

// yes i used AI for the words and hints, sue me
// i cannot be bothered
// and i dont want to know the hints for when i play
EverydayObjects = new Category("Everyday Objects", []);
 
EverydayObjects.definitions.push(new CategoryDefinition("Fork",           ["stabbing", "prongs", "cutlery"]));
EverydayObjects.definitions.push(new CategoryDefinition("Spoon",          ["soup", "cutlery", "bending"]));
EverydayObjects.definitions.push(new CategoryDefinition("Knife",          ["spreading", "sharp", "cutlery"]));
EverydayObjects.definitions.push(new CategoryDefinition("Mug",            ["handle", "morning", "ceramic"]));
EverydayObjects.definitions.push(new CategoryDefinition("Kettle",         ["boiling", "steam", "first thing"]));
EverydayObjects.definitions.push(new CategoryDefinition("Toaster",        ["bread", "pop up", "burning"]));
EverydayObjects.definitions.push(new CategoryDefinition("Microwave",      ["beeping", "spinning", "fork"]));
EverydayObjects.definitions.push(new CategoryDefinition("Fridge",         ["humming", "cold", "3am"]));
EverydayObjects.definitions.push(new CategoryDefinition("Bin",            ["smelly", "overflowing", "chore"]));
EverydayObjects.definitions.push(new CategoryDefinition("Toilet",         ["throne", "scrolling", "flushing"]));
EverydayObjects.definitions.push(new CategoryDefinition("Toothbrush",     ["bristles", "minty", "twice daily"]));
EverydayObjects.definitions.push(new CategoryDefinition("Soap",           ["lather", "slippery", "dropped"]));
EverydayObjects.definitions.push(new CategoryDefinition("Mirror",         ["reflection", "selfie", "cracked"]));
EverydayObjects.definitions.push(new CategoryDefinition("Towel",          ["damp", "drying", "stolen"]));
EverydayObjects.definitions.push(new CategoryDefinition("Pillow",         ["drooling", "flipping", "soft side"]));
EverydayObjects.definitions.push(new CategoryDefinition("Alarm Clock",    ["snooze", "despised", "morning"]));
EverydayObjects.definitions.push(new CategoryDefinition("Remote Control", ["missing", "sofa", "batteries"]));
EverydayObjects.definitions.push(new CategoryDefinition("Charger",        ["panic", "cable", "borrowing"]));
EverydayObjects.definitions.push(new CategoryDefinition("Scissors",       ["running", "cutting", "snipping"]));
EverydayObjects.definitions.push(new CategoryDefinition("Sellotape",      ["wrapping", "sticky", "roll"]));
EverydayObjects.definitions.push(new CategoryDefinition("Ruler",          ["measuring", "straight", "desk"]));
EverydayObjects.definitions.push(new CategoryDefinition("Rubber",         ["erasing", "smudging", "pencil"]));
EverydayObjects.definitions.push(new CategoryDefinition("Stapler",        ["binding", "clicking", "desk"]));
EverydayObjects.definitions.push(new CategoryDefinition("Pen",            ["clicking", "ink", "chewing"]));
EverydayObjects.definitions.push(new CategoryDefinition("Pencil",         ["snapping", "sharpening", "sketching"]));
EverydayObjects.definitions.push(new CategoryDefinition("Umbrella",       ["rain", "forgotten", "inside luck"]));
EverydayObjects.definitions.push(new CategoryDefinition("Wallet",         ["empty", "leather", "back pocket"]));
EverydayObjects.definitions.push(new CategoryDefinition("Keys",           ["lost", "jangling", "spare"]));
EverydayObjects.definitions.push(new CategoryDefinition("Glasses",        ["squinting", "four eyes", "frames"]));
EverydayObjects.definitions.push(new CategoryDefinition("Watch",          ["wrist", "ticking", "late"]));
EverydayObjects.definitions.push(new CategoryDefinition("Backpack",       ["straps", "school", "overpacked"]));
EverydayObjects.definitions.push(new CategoryDefinition("Candle",         ["power cut", "romantic", "birthday"]));
EverydayObjects.definitions.push(new CategoryDefinition("Lightbulb",      ["idea", "flickering", "changing"]));
EverydayObjects.definitions.push(new CategoryDefinition("Plaster",        ["ouch", "peeling", "wound"]));
EverydayObjects.definitions.push(new CategoryDefinition("Hammer",         ["nails", "thumb", "DIY"]));
EverydayObjects.definitions.push(new CategoryDefinition("Screwdriver",    ["flat pack", "turning", "cross tip"]));
EverydayObjects.definitions.push(new CategoryDefinition("Iron",           ["creases", "steam", "chore"]));
EverydayObjects.definitions.push(new CategoryDefinition("Dustpan",        ["sweeping", "brush", "corners"]));
EverydayObjects.definitions.push(new CategoryDefinition("Smoke Alarm",    ["beeping", "cooking", "ceiling"]));
EverydayObjects.definitions.push(new CategoryDefinition("Doorbell",       ["ding dong", "ignored", "visitors"]));


FoodAndDrinks = new Category("Food & Drinks", []);
 
FoodAndDrinks.definitions.push(new CategoryDefinition("Apple",         ["orchard", "doctor", "crunchy"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Banana",        ["slipping", "yellow", "monkey"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Strawberry",    ["Wimbledon", "summer", "jam"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Watermelon",    ["seeds", "summer", "pink"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Grapes",        ["wine", "bunch", "seedless"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Lemon",         ["sour", "zest", "life gives"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Avocado",       ["toast", "expensive", "millennial"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Carrot",        ["rabbit", "orange", "vision"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Onion",         ["crying", "layers", "Shrek"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Garlic",        ["vampire", "breath", "bulb"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Potato",        ["mashed", "jacket", "Irish"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Mushroom",      ["Mario", "earthy", "fungi"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Bacon",         ["sizzling", "smell", "crispy"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Egg",           ["shell", "yolk", "scrambled"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Cheese",        ["melting", "aged", "moon"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Butter",        ["toast", "spreading", "fingers"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Bread",         ["loaf", "toasted", "carbs"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Pasta",         ["Italian", "shapes", "al dente"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Pizza",         ["round", "toppings", "debate"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Burger",        ["bun", "patty", "smash"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Chips",         ["salt", "vinegar", "seagulls"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Curry",         ["spicy", "naan", "Friday night"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Soup",          ["ill", "sipping", "tin"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Sushi",         ["raw", "chopsticks", "rolling"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Pancake",       ["flipping", "Tuesday", "syrup"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Chocolate",     ["melting", "box", "dark or milk"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Cake",          ["birthday", "lie", "icing"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Biscuit",       ["dunking", "tin", "crumbs"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Crisps",        ["rustling", "sharing bag", "flavour"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Ice Cream",     ["van", "cone", "melting"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Popcorn",       ["cinema", "kernels", "salted or sweet"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Tea",           ["British", "builder's", "biscuit"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Coffee",        ["bitter", "morning", "addicted"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Orange Juice",  ["pulp", "breakfast", "vitamin C"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Milk",          ["white", "carton", "moustache"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Beer",          ["pint", "pub", "foam"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Wine",          ["glass", "red or white", "mum"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Hot Chocolate", ["marshmallow", "winter", "cosy"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Lemonade",      ["fizzy", "pink or yellow", "garden party"]));
FoodAndDrinks.definitions.push(new CategoryDefinition("Ketchup",       ["squeezy", "debated", "red"]));


Animals = new Category("Animals", []);

Animals.definitions.push(new CategoryDefinition("Dog",           ["paws", "loyal", "fetch"]));
Animals.definitions.push(new CategoryDefinition("Cat",           ["whiskers", "purring", "internet"]));
Animals.definitions.push(new CategoryDefinition("Rabbit",        ["floppy ears", "hutch", "Easter"]));
Animals.definitions.push(new CategoryDefinition("Hamster",       ["wheel", "cheeks", "tiny"]));
Animals.definitions.push(new CategoryDefinition("Goldfish",      ["bowl", "orange", "memory"]));
Animals.definitions.push(new CategoryDefinition("Parrot",        ["colourful", "beak", "pirate"]));
Animals.definitions.push(new CategoryDefinition("Tortoise",      ["shell", "slow", "ancient"]));
Animals.definitions.push(new CategoryDefinition("Cow",           ["udder", "pasture", "tipping"]));
Animals.definitions.push(new CategoryDefinition("Pig",           ["snout", "mud", "Peppa"]));
Animals.definitions.push(new CategoryDefinition("Sheep",         ["wool", "flock", "counting"]));
Animals.definitions.push(new CategoryDefinition("Horse",         ["hooves", "mane", "racing"]));
Animals.definitions.push(new CategoryDefinition("Chicken",       ["feathers", "pecking", "nugget"]));
Animals.definitions.push(new CategoryDefinition("Duck",          ["webbed", "pond", "rubber"]));
Animals.definitions.push(new CategoryDefinition("Lion",          ["mane", "pride", "Simba"]));
Animals.definitions.push(new CategoryDefinition("Elephant",      ["trunk", "tusks", "never forgets"]));
Animals.definitions.push(new CategoryDefinition("Giraffe",       ["long neck", "tall", "spotted"]));
Animals.definitions.push(new CategoryDefinition("Zebra",         ["stripes", "Africa", "crossing"]));
Animals.definitions.push(new CategoryDefinition("Gorilla",       ["silverback", "knuckles", "chest beating"]));
Animals.definitions.push(new CategoryDefinition("Hippo",         ["river", "huge mouth", "hungry"]));
Animals.definitions.push(new CategoryDefinition("Crocodile",     ["scales", "snapping", "tears"]));
Animals.definitions.push(new CategoryDefinition("Meerkat",       ["upright", "desert", "compare the"]));
Animals.definitions.push(new CategoryDefinition("Tiger",         ["stripes", "orange", "Tony"]));
Animals.definitions.push(new CategoryDefinition("Monkey",        ["swinging", "tail", "barrel"]));
Animals.definitions.push(new CategoryDefinition("Sloth",         ["claws", "hanging", "Monday"]));
Animals.definitions.push(new CategoryDefinition("Shark",         ["fin", "teeth", "Jaws"]));
Animals.definitions.push(new CategoryDefinition("Dolphin",       ["fin", "clicking", "Flipper"]));
Animals.definitions.push(new CategoryDefinition("Whale",         ["blowhole", "huge", "Moby"]));
Animals.definitions.push(new CategoryDefinition("Octopus",       ["eight arms", "ink", "jar"]));
Animals.definitions.push(new CategoryDefinition("Crab",          ["claws", "sideways", "grumpy"]));
Animals.definitions.push(new CategoryDefinition("Clownfish",     ["orange", "anemone", "Nemo"]));
Animals.definitions.push(new CategoryDefinition("Penguin",       ["flippers", "tuxedo", "sliding"]));
Animals.definitions.push(new CategoryDefinition("Owl",           ["nocturnal", "rotating head", "Hogwarts"]));
Animals.definitions.push(new CategoryDefinition("Flamingo",      ["pink", "one leg", "wading"]));
Animals.definitions.push(new CategoryDefinition("Swan",          ["graceful", "long neck", "aggressive"]));
Animals.definitions.push(new CategoryDefinition("Bee",           ["hive", "sting", "honey"]));
Animals.definitions.push(new CategoryDefinition("Spider",        ["eight legs", "web", "Man"]));
Animals.definitions.push(new CategoryDefinition("Snail",         ["shell", "trail", "slow"]));
Animals.definitions.push(new CategoryDefinition("Wolf",          ["pack", "howling", "huffing"]));
Animals.definitions.push(new CategoryDefinition("Fox",           ["bushy tail", "cunning", "urban"]));
Animals.definitions.push(new CategoryDefinition("Reindeer",      ["antlers", "cold", "Rudolph"]));


Sports = new Category("Sports", []);
 
Sports.definitions.push(new CategoryDefinition("Football",       ["pitch", "offside", "VAR"]));
Sports.definitions.push(new CategoryDefinition("Basketball",     ["hoop", "dribbling", "tall"]));
Sports.definitions.push(new CategoryDefinition("Tennis",         ["net", "racket", "Wimbledon"]));
Sports.definitions.push(new CategoryDefinition("Rugby",          ["scrum", "muddy", "oval"]));
Sports.definitions.push(new CategoryDefinition("Cricket",        ["wicket", "whites", "tea break"]));
Sports.definitions.push(new CategoryDefinition("Baseball",       ["bat", "cap", "American"]));
Sports.definitions.push(new CategoryDefinition("Golf",           ["green", "par", "quiet"]));
Sports.definitions.push(new CategoryDefinition("Snooker",        ["baize", "cue", "hushed"]));
Sports.definitions.push(new CategoryDefinition("Darts",          ["bullseye", "oche", "pub"]));
Sports.definitions.push(new CategoryDefinition("Boxing",         ["gloves", "ring", "southpaw"]));
Sports.definitions.push(new CategoryDefinition("Wrestling",      ["mat", "pinned", "staged"]));
Sports.definitions.push(new CategoryDefinition("Judo",           ["gi", "thrown", "belt"]));
Sports.definitions.push(new CategoryDefinition("Fencing",        ["sword", "mask", "lunge"]));
Sports.definitions.push(new CategoryDefinition("Swimming",       ["lanes", "goggles", "chlorine"]));
Sports.definitions.push(new CategoryDefinition("Surfing",        ["waves", "board", "wipeout"]));
Sports.definitions.push(new CategoryDefinition("Rowing",         ["oars", "blisters", "early"]));
Sports.definitions.push(new CategoryDefinition("Diving",         ["tuck", "height", "splash"]));
Sports.definitions.push(new CategoryDefinition("Sailing",        ["mast", "wind", "rope"]));
Sports.definitions.push(new CategoryDefinition("Sprinting",      ["blocks", "explosive", "seconds"]));
Sports.definitions.push(new CategoryDefinition("Marathon",       ["wall", "blisters", "26 miles"]));
Sports.definitions.push(new CategoryDefinition("High Jump",      ["bar", "flop", "arch"]));
Sports.definitions.push(new CategoryDefinition("Javelin",        ["spear", "runway", "throwing"]));
Sports.definitions.push(new CategoryDefinition("Shot Put",       ["heavy", "circle", "neck"]));
Sports.definitions.push(new CategoryDefinition("Cycling",        ["peloton", "saddle", "lycra"]));
Sports.definitions.push(new CategoryDefinition("Skateboarding",  ["ollie", "concrete", "grip tape"]));
Sports.definitions.push(new CategoryDefinition("Skiing",         ["slopes", "poles", "chairlift"]));
Sports.definitions.push(new CategoryDefinition("Snowboarding",   ["halfpipe", "bindings", "tricks"]));
Sports.definitions.push(new CategoryDefinition("Ice Hockey",     ["puck", "checking", "zamboni"]));
Sports.definitions.push(new CategoryDefinition("Ice Skating",    ["blades", "rink", "cold"]));
Sports.definitions.push(new CategoryDefinition("Curling",        ["sweeping", "stone", "broom"]));
Sports.definitions.push(new CategoryDefinition("Gymnastics",     ["beam", "chalk", "flipping"]));
Sports.definitions.push(new CategoryDefinition("Archery",        ["bow", "arrow", "bullseye"]));
Sports.definitions.push(new CategoryDefinition("Weightlifting",  ["barbell", "chalk", "clean"]));
Sports.definitions.push(new CategoryDefinition("Badminton",      ["shuttlecock", "racket", "garden"]));
Sports.definitions.push(new CategoryDefinition("Squash",         ["walls", "enclosed", "sweaty"]));
Sports.definitions.push(new CategoryDefinition("Table Tennis",   ["paddle", "spin", "basement"]));
Sports.definitions.push(new CategoryDefinition("Horse Racing",   ["jockey", "odds", "silks"]));
Sports.definitions.push(new CategoryDefinition("Rock Climbing",  ["harness", "chalk", "overhang"]));
Sports.definitions.push(new CategoryDefinition("American Football", ["helmet", "touchdown", "huddle"]));
Sports.definitions.push(new CategoryDefinition("Triathlon",      ["transition", "endurance", "brick"]));


People = new Category("People", []);

People.definitions.push(new CategoryDefinition("Will Smith",       ["slap", "Prince", "rewind"]));
People.definitions.push(new CategoryDefinition("Tom Hanks",        ["Forrest", "nice guy", "Wilson"]));
People.definitions.push(new CategoryDefinition("Leonardo DiCaprio", ["Jack", "Oscar wait", "young"]));
People.definitions.push(new CategoryDefinition("Dwayne Johnson",   ["Rock", "eyebrow", "jacked"]));
People.definitions.push(new CategoryDefinition("Ryan Reynolds",    ["Deadpool", "sarcastic", "gin"]));
People.definitions.push(new CategoryDefinition("Keanu Reeves",     ["Neo", "wholesome", "pencil"]));
People.definitions.push(new CategoryDefinition("Robert Downey Jr", ["Iron Man", "memes", "suit"]));
People.definitions.push(new CategoryDefinition("Brad Pitt",        ["eating", "handsome", "Fight Club"]));
People.definitions.push(new CategoryDefinition("Johnny Depp",      ["Jack Sparrow", "trial", "eyeliner"]));
People.definitions.push(new CategoryDefinition("Morgan Freeman",   ["narrator", "God", "voice"]));
People.definitions.push(new CategoryDefinition("Scarlett Johansson", ["Black Widow", "Marvel", "blonde"]));
People.definitions.push(new CategoryDefinition("Jennifer Lawrence", ["clumsy", "Katniss", "relatable"]));
People.definitions.push(new CategoryDefinition("Taylor Swift",     ["eras", "cats", "heartbreak"]));
People.definitions.push(new CategoryDefinition("Beyonce",          ["Sasha Fierce", "Lemonade", "queen"]));
People.definitions.push(new CategoryDefinition("Rihanna",          ["umbrella", "Fenty", "halftime"]));
People.definitions.push(new CategoryDefinition("Drake",            ["Views", "beef", "Toronto"]));
People.definitions.push(new CategoryDefinition("Kanye West",       ["Imma let you finish", "Yeezy", "controversial"]));
People.definitions.push(new CategoryDefinition("Eminem",           ["slim shady", "rap god", "Detroit"]));
People.definitions.push(new CategoryDefinition("Ed Sheeran",       ["ginger", "guitar", "loop pedal"]));
People.definitions.push(new CategoryDefinition("Adele",            ["Hello", "crying", "power"]));
People.definitions.push(new CategoryDefinition("Justin Bieber",    ["Baby", "hair flip", "Beliebers"]));
People.definitions.push(new CategoryDefinition("Billie Eilish",    ["whispering", "green hair", "brother"]));
People.definitions.push(new CategoryDefinition("Post Malone",      ["tattoos", "face", "mumble"]));
People.definitions.push(new CategoryDefinition("Harry Styles",     ["One Direction", "feather boa", "nails"]));
People.definitions.push(new CategoryDefinition("Ariana Grande",    ["ponytail", "high note", "thank u next"]));
People.definitions.push(new CategoryDefinition("Nicki Minaj",      ["Barbie", "rap", "pink"]));
People.definitions.push(new CategoryDefinition("The Weeknd",       ["Blinding Lights", "red jacket", "Super Bowl"]));
People.definitions.push(new CategoryDefinition("Kendrick Lamar",   ["Pulitzer", "beef", "Compton"]));
People.definitions.push(new CategoryDefinition("Cristiano Ronaldo", ["Siuuu", "abs", "GOAT debate"]));
People.definitions.push(new CategoryDefinition("Lionel Messi",     ["dribbling", "World Cup", "GOAT debate"]));
People.definitions.push(new CategoryDefinition("Usain Bolt",       ["lightning", "pose", "fastest"]));
People.definitions.push(new CategoryDefinition("Serena Williams",  ["dominant", "tennis", "power"]));
People.definitions.push(new CategoryDefinition("LeBron James",     ["King", "Cleveland", "hairline"]));
People.definitions.push(new CategoryDefinition("Mike Tyson",       ["ear", "tattoo", "feared"]));
People.definitions.push(new CategoryDefinition("Donald Trump",     ["wall", "orange", "Twitter"]));
People.definitions.push(new CategoryDefinition("Barack Obama",     ["Hope", "mic drop", "cool"]));
People.definitions.push(new CategoryDefinition("Elon Musk",        ["rockets", "Twitter", "edgy"]));
People.definitions.push(new CategoryDefinition("Mark Zuckerberg",  ["robot", "Facebook", "lizard"]));
People.definitions.push(new CategoryDefinition("Epstein",          ["goat", "temple", "babies", "isreal"]))
People.definitions.push(new CategoryDefinition("Netanyahu",        ["goat", "isreal", "geneva-convention", "babysitter"]))
People.definitions.push(new CategoryDefinition("Diddy",            ["beiber", "lube", "party"]))
People.definitions.push(new CategoryDefinition("Johnny sins",      ["plumber", "astronaut", "electritian", "doctor"]))
People.definitions.push(new CategoryDefinition("Evie",             ["wedding", "85KG", "crashout"]))

Characters = new Category("Characters", []);

Characters.definitions.push(new CategoryDefinition("Iron Man",        ["suit", "genius", "I am"]));
Characters.definitions.push(new CategoryDefinition("Spider-Man",      ["web", "responsibility", "mask"]));
Characters.definitions.push(new CategoryDefinition("Thor",            ["hammer", "lightning"]));
Characters.definitions.push(new CategoryDefinition("Thanos",          ["snap", "gauntlet", "balanced"]));
Characters.definitions.push(new CategoryDefinition("Deadpool",        ["fourth wall", "red suit", "regenerating"]));
Characters.definitions.push(new CategoryDefinition("Black Widow",     ["spy", "red hair", "Natasha"]));
Characters.definitions.push(new CategoryDefinition("Wolverine",       ["claws", "healing", "grumpy"]));
Characters.definitions.push(new CategoryDefinition("Batman",          ["cave", "powerless", "orphan"]));
Characters.definitions.push(new CategoryDefinition("Superman",        ["redo these they were too obvious"]));
Characters.definitions.push(new CategoryDefinition("The Joker",       ["chaos", "laugh", "paint"]));
Characters.definitions.push(new CategoryDefinition("Wonder Woman",    ["lasso", "wrist/headband", "shield"]));
Characters.definitions.push(new CategoryDefinition("The Flash",       ["fast", "red", "lightning"]));
Characters.definitions.push(new CategoryDefinition("Thragg",          ["hairline", "aurafarm", "regent"]));
Characters.definitions.push(new CategoryDefinition("Walter White",    ["chemistry", "say my name", "bald"]));
Characters.definitions.push(new CategoryDefinition("Sherlock Holmes", ["deduction", "pipe", "elementary"]));
Characters.definitions.push(new CategoryDefinition("The Mandalorian", ["bounty", "Grogu", "helmet"]));
Characters.definitions.push(new CategoryDefinition("Jack Sparrow",    ["rum", "compass", "stumbling"]));
Characters.definitions.push(new CategoryDefinition("Darth Vader",     ["breathing", "father", "dark side"]));
Characters.definitions.push(new CategoryDefinition("The Terminator",  ["thumbs up", "chrome", "Arnie"]));
Characters.definitions.push(new CategoryDefinition("Forrest Gump",    ["running", "chocolates", "shrimp"]));
Characters.definitions.push(new CategoryDefinition("Patrick Bateman", ["business card", "axe", "moisturiser"]));
Characters.definitions.push(new CategoryDefinition("John Wick",       ["dog", "pencil", "suit"]));
Characters.definitions.push(new CategoryDefinition("Voldemort",       ["nose", "horcrux", "he who"]));
Characters.definitions.push(new CategoryDefinition("Arthur Morgan",   ["honour", "horse", "coughing", "IM GONNA TOUCH YOU NOW SON"]));
Characters.definitions.push(new CategoryDefinition("Kratos",          ["ash", "spartan", "boy"]));
Characters.definitions.push(new CategoryDefinition("Sonic",           ["rings", "fast", "hedgehog"]));
Characters.definitions.push(new CategoryDefinition("Agent 47",        ["bald", "barcode", "hitman"]));


Freaky = new Category("Freaky", []);
Freaky.definitions.push(new CategoryDefinition("rose toy", ["flower", "vibrate", "mum's bedroom"]))
Freaky.definitions.push(new CategoryDefinition("dildo", ["suction", "lightsaber", "shoebox"]))
Freaky.definitions.push(new CategoryDefinition("yaoi", ["best", "2", "homo", "guys"]))
Freaky.definitions.push(new CategoryDefinition("yuri", ["2", "homo", "girls"]))
Freaky.definitions.push(new CategoryDefinition("backshots", ["doggy", "goon", "behind"]))
Freaky.definitions.push(new CategoryDefinition("ejaculation", ["creamy", "salty", "sticky"]))
Freaky.definitions.push(new CategoryDefinition("femboy", ["best", "dih", "thigh-highs"]))
Freaky.definitions.push(new CategoryDefinition("ladyboy", ["surprise", "thailand", "dih"]))
Freaky.definitions.push(new CategoryDefinition("penis", ["head", "tip", "goon", "vein"]))
Freaky.definitions.push(new CategoryDefinition("bumming", ["behind", "sketch", "lube", "poopy"]))
Freaky.definitions.push(new CategoryDefinition("post-nut clarity", ["after", "regret", "sticky"]))
Freaky.definitions.push(new CategoryDefinition("furries", ["amazing", "suit", "fluffy", "crackable", "con"]))
Freaky.definitions.push(new CategoryDefinition("vagina", ["wet", "tight", "loose", "beef"]))
Freaky.definitions.push(new CategoryDefinition("boobs", ["pair", "seth", "squish"]))
Freaky.definitions.push(new CategoryDefinition("breast-milk", ["seth", "'omelandah", "protein"]))


AddCategoryButton(EverydayObjects, true);
AddCategoryButton(FoodAndDrinks);
AddCategoryButton(Animals);
AddCategoryButton(Sports);
AddCategoryButton(People);
AddCategoryButton(Characters);
AddCategoryButton(Freaky)

const PlayButton = document.getElementById("PlayButton");
const GameplayWindow = document.getElementById("GameplayWindow");
PlayButton.addEventListener("click", () => {
    BeginGame();
});

const GameplayExitButton = document.getElementById("GameplayExitButton");
GameplayExitButton.addEventListener("click", () => {
    const exit = confirm("Are you sure you want to end the game?");
    if (exit)
    {
        GameplayWindow.classList.add("inactive");
        DiscussionWindow.classList.add("inactive");
    }
});

function BeginGame()
{
    if (selectedCategories.length < 1) 
    {
        alert("No selected categories");
        return;
    }

    let categoryI = Math.floor(Math.random() * selectedCategories.length);
    let definitionI = Math.floor(Math.random() * selectedCategories[categoryI].definitions.length);
    let hintI = Math.floor(Math.random() * selectedCategories[categoryI].definitions[definitionI].hints.length);

    selectedCategoryName = selectedCategories[categoryI].name;
    selectedWord = selectedCategories[categoryI].definitions[definitionI].word;
    selectedHint = selectedCategories[categoryI].definitions[definitionI].hints[hintI];

    impostors = [];
    while (true)
    {
        let index = Math.floor(Math.random() * players.length);
        if (!impostors.includes(index))
        {
            impostors.push(index);
        }
        if (impostors.length >= ImposterCount)
        {
            break;
        }
    }

    viewingPlayer = 0;
    GameplayWindow.classList.remove("inactive");
    UpdateCard();
}

const NextPlayerButton = document.getElementById("NextPlayerButton");
const FlipCardInner = document.querySelector(".flip-card-inner");
const ImposterRevealText = document.getElementById("ImposterRevealText");

let canNext = false;
function UpdateCard()
{
    document.getElementById("PlayerNameText1").textContent = players[viewingPlayer].name;
    document.getElementById("PlayerNameText2").textContent = players[viewingPlayer].name;
    document.getElementById("WordText").textContent = impostors.includes(viewingPlayer) ? selectedHint : selectedWord;

    if (impostors.includes(viewingPlayer))
    {
        ImposterRevealText.classList.remove("inactive");
    }
    else
    {
        ImposterRevealText.classList.add("inactive");
    }

    canNext = true;
};

FlipCardInner.addEventListener("transitionend", () => UpdateCard());

document.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".flip-card"))    {
        NextPlayerButton.classList.remove("inactive");
        FlipCardInner.style.transform = "rotateY(180deg)";
    }
});

NextPlayerButton.addEventListener("click", () => {
    if (!canNext) return;
    NextPlayer();
});

const flipcard = document.querySelector(".flip-card");
const StartsConvoText = document.getElementById("StartsConvoText");
function NextPlayer()
{
    viewingPlayer++;
    canNext = false;

    NextPlayerButton.classList.add("inactive");
    FlipCardInner.style.transform = "rotateY(0deg)";

    if (viewingPlayer >= players.length)
    {
        viewingPlayer = 0;
        DiscussionWindow.classList.remove("inactive");

        setTimeout(() => {
            GameplayWindow.classList.add("inactive");
        }, 400);

        const startsIndex = Math.floor(Math.random() * players.length - 0.001);
        StartsConvoText.textContent = players[startsIndex].name + " starts the conversation!";
        return;
    }

    flipcard.classList.remove("slide-cycle");
    void flipcard.offsetWidth;
    flipcard.classList.add("slide-cycle");
}

const DiscussionWindow = document.getElementById("DiscussionWindow");
const DiscussionExitButton = document.getElementById("DiscussionExitButton");
DiscussionExitButton.addEventListener("click", () => {
    // yes or no window popup

    const exit = confirm("Are you sure you want to end the game?");
    if (exit)
    {
        DiscussionWindow.classList.add("inactive");
    }
});

const RevealWindow = document.getElementById("RevealWindow");
const RevealExitButton = document.getElementById("RevealExitButton");
const RevealedImpostersText = document.getElementById("RevealedImpostersText");
const RevealedWordText = document.getElementById("RevealedWordText");
const NewGameButton = document.getElementById("NewGameButton");

function RevealImpostors()
{
    setTimeout(() => {
        DiscussionWindow.classList.add("inactive");
    }, 400);

    RevealWindow.classList.remove("inactive");
    let imposterNames = "";
    for (let i = 0; i < impostors.length; i++)
    {
        imposterNames += players[impostors[i]].name;
        imposterNames += ", ";
    }
    RevealedImpostersText.textContent = imposterNames.slice(0, -2);
    RevealedWordText.textContent = selectedWord;
}

const RevealImpostButton = document.getElementById("RevealImpostButton");
RevealImpostButton.addEventListener("click", () => {
    RevealImpostors();
});

RevealExitButton.addEventListener("click", () => {
    RevealWindow.classList.add("inactive");
});
NewGameButton.addEventListener("click", () => {
    RevealWindow.classList.add("inactive");
});
