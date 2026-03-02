window.QUIZ_DATA = {
    title: "Look at these pictures. Write their names.",
    type: "complete-fib",
    description: "Check What You Know",
    mcq: {
        backgroundImage: "./images/background.png",
        questions: [
            {
                "question": "Which word is an emphasising adjective?",
                "options": ["big", "very", "green", "fast"],
                "correctIndex": 1
            },
            {
                "question": "Identify the emphasising adjective in, 'She told the actual truth about the event.'",
                "options": ["event", "truth", "told", "actual"],
                "correctIndex": 3
            },
            {
                "question": "Which is an indefinite adjective?",
                "options": ["Indian", "each", "tired", "noisy"],
                "correctIndex": 1
            },
            {
                "question": "Choose the sentence with an indefinite adjective.",
                "options": [
                    "This is the real reason.",
                    "Few students finished early.",
                    "He found his own pen.",
                    "That is a red apple."
                ],
                "correctIndex": 1
            },
            {
                "question": "What does the adjective own show in this sentence: 'She wrote her own speech.'",
                "options": ["colour", "time", "ownership", "size"],
                "correctIndex": 2
            }
        ]
    },
    //----------------------------Fill in thr blanks-----------------------------------------------
    // Fill-in-the-Blanks
    fib_with_img: {
        backgroundImage: "./images/background.png",
        wordBank: ["farmer", "baker", "boy", "teacher", "singer", "girl"],
        questions: [
            {
                id: 1,
                question: "",
                answer: "house",
                image: "./images/1.png",
                placeholder: "t r _ _",
                blanks: "ee",        // only the missing letters
            },
            {
                id: 2,
                question: "1. The first picture shows a ______.",
                answer: "hospital",
                image: "./images/2.png",
                placeholder: "d r _ v _ r",
                blanks: "ie",        // missing letters at positions 3 and 5
            },
            {
                id: 3,
                question: "1. The first picture shows a ______.",
                answer: "school",
                image: "./images/3.png",
                placeholder: "t _ b l _",
                blanks: "ae",
            },
            {
                id: 4,
                question: "1. The first picture shows a ______.",
                answer: "village",
                image: "./images/4.png",
                placeholder: "n _ r s _",
                blanks: "ue",
            },
            {
                id: 5,
                question: "1. The first picture shows a ______.",
                answer: "park",
                image: "./images/5.png",
                placeholder: "g _ _ t",
                blanks: "oa",
            },
            {
                id: 6,
                question: "1. The first picture shows a ______.",
                answer: "beach",
                image: "./images/6.png",
                placeholder: "o _ l",
                blanks: "w",
            },
            {
                id: 7,
                question: "1. The first picture shows a ______.",
                answer: "beach",
                image: "./images/7.png",
                placeholder: "m _ rk _ t",
                blanks: "ae",
            },
            {
                id: 8,
                question: "1. The first picture shows a ______.",
                answer: "beach",
                image: "./images/8.png",
                placeholder: "k _ tch _ n",
                blanks: "ie",
            }
        ]
    },
    fib_with_table: {
        backgroundImage: "NULL",
        title: "D. Write the naming words in the correct columns.",
        wordBank: [
            "parrot", "lion", "monkey", "child", "mall",
            "jeep", "teacher", "giraffe", "hat",
            "baker", "museum", "office", "grass",
            "tailor", "bank", "stone"
        ],

        categories: [
            {
                title: "Person",
                answers: ["child", "teacher", "baker", "tailor"]
            },
            {
                title: "Animal and Bird",
                answers: ["parrot", "lion", "monkey", "giraffe"]
            },
            {
                title: "Place",
                answers: ["mall", "museum", "office", "bank"]
            },
            {
                title: "Thing",
                answers: ["jeep", "hat", "grass", "stone"]
            }
        ]
    },
    fib_with_OneBlank: {
        backgroundImage: "NULL",
        title: "C. Use capital letters. Rewrite the special naming words.",
        questions: [
            { id: 1, question: "Rewrite using capital letters:", word: "kerala", answer: "Kerala" },
            { id: 2, question: "Rewrite using capital letters:", word: "london", answer: "London" },
            { id: 3, question: "Rewrite using capital letters:", word: "gujarat", answer: "Gujarat" },
            { id: 4, question: "Rewrite using capital letters:", word: "daisy school", answer: "Daisy School" },
            { id: 5, question: "Rewrite using capital letters:", word: "nepal", answer: "Nepal" },
            { id: 6, question: "Rewrite using capital letters:", word: "assam", answer: "Assam" }
        ]
    },
    fib_with_Simple: {
        backgroundImage: "NULL",
        title: "B. Write has / have.",
        wordBox: ["has", "have", "Can"],
        questions: [
            { id: 1, before: "I", after: "friends.", answer: "have" },
            { id: 2, before: "He", after: "a cat.", answer: "has" },
            { id: 3, before: "It", after: "small ears.", answer: "has" },
            { id: 4, before: "We", after: "balloons.", answer: "have" },
            { id: 5, before: "They", after: "a house.", answer: "have" },
            { id: 6, before: "You", after: "two pens.", answer: "have" },
            { id: 7, before: "She", after: "an orange.", answer: "has" },
            { id: 8, before: "Anu and Priya", after: "new bags.", answer: "have" }
        ]
    },
    Fib_Simple_Image: {
        title: "Complete the sentences from the image.",
        wordBox: [
            "need to eat",
            "want to go out",
            "need to pay",
            "want to walk",
            "want to paint",
            "need to repair"
        ],
        questions: [
            {
                id: 1,
                image: "/images/teacher.png",
                sentence: {
                    before: "You",
                    after: "for gas and electricity."
                },
                answer: "need to pay"
            },
            {
                id: 2,
                image: "/images/boy.png",
                sentence: {
                    before: "I",
                    after: "our bedroom blue."
                },
                answer: "want to paint"
            },
            {
                id: 3,
                image: "/images/boy.png",
                sentence: {
                    before: "I",
                    after: "our bedroom blue."
                },
                answer: "want to paint"
            },
            {
                id: 4,
                image: "/images/boy.png",
                sentence: {
                    before: "I",
                    after: "our bedroom blue."
                },
                answer: "want to paint"
            },
            {
                id: 5,
                image: "/images/boy.png",
                sentence: {
                    before: "I",
                    after: "our bedroom blue."
                },
                answer: "want to paint"
            },
            {
                id: 6,
                image: "/images/boy.png",
                sentence: {
                    before: "I",
                    after: "our bedroom blue."
                },
                answer: "want to paint"
            },
        ]
    },
    //---------------------------------------------------------------------------
    circle_words: {
        questions: [
            {
                question: "Row 1",
                options: ["diary", "photo", "Diksha", "curtain"],
                correctIndex: 2
            },
            {
                question: "Row 2",
                options: ["policeman", "postman", "soldier", "Jatin"],
                correctIndex: 3
            },
            {
                question: "Row 3",
                options: ["India Gate", "mall", "road", "street"],
                correctIndex: 0
            },
            {
                question: "Row 4",
                options: ["town", "New Delhi", "village", "city"],
                correctIndex: 1
            },
            {
                question: "Row 5",
                options: ["zebra", "camel", "sheep", "Simba"],
                correctIndex: 3
            },
            {
                question: "Row 6",
                options: ["kite", "crow", "June", "sparrow"],
                correctIndex: 2
            }
        ]
    },
    highlight_and_erase: {
        questions: [
            {
                words: ["The", "boy", "and", "the", "girl", "are", "in", "the", "park."],
                correctIndices: [1, 4, 8]
            },
            {
                words: ["Cats", "miaow."],
                correctIndices: [0]
            },
            {
                words: ["I", "keep", "the", "water", "in", "the", "pot."],
                correctIndices: [3, 6]
            },
            {
                words: ["Dad", "makes", "soup."],
                correctIndices: [0, 2]
            },
            {
                words: ["We", "like", "apples", "and", "bananas."],
                correctIndices: [2, 4]
            },
            {
                words: ["Your", "house", "is", "big."],
                correctIndices: [1]
            }
        ]
    },
    mcq_with_images: {
        questions: [
            {
                question: "Which image shows a 'rat'?",
                options: [
                    { label: "Cat", image: "/mcq-images/dog.png" },
                    { label: "Rat", image: "/mcq-images/rat.png" },
                    { label: "Penguin", image: "/mcq-images/penguin.png" },
                    { label: "Dog", image: "/mcq-images/dog.png" }
                ],
                correctIndex: 1
            },
            {
                question: "Identify the 'umbrella'.",
                options: [
                    { label: "Bag", image: "/mcq-images/bag.png" },
                    { label: "Pen", image: "/mcq-images/pen.png" },
                    { label: "Umbrella", image: "/mcq-images/umbrella.png" },
                    { label: "Dog", image: "/mcq-images/dog.png" }
                ],
                correctIndex: 2
            },
            {
                question: "Who is the 'girl'?",
                options: [
                    { label: "Boy", image: "/mcq-images/boy.png" },
                    { label: "Woman", image: "/mcq-images/woman.png" },
                    { label: "Girl", image: "/mcq-images/girl.png" },
                    { label: "Man", image: "/mcq-images/boy3.png" }
                ],
                correctIndex: 2
            },
            {
                question: "Which one is a 'bag'?",
                options: [
                    { label: "Pen", image: "/mcq-images/pen.png" },
                    { label: "Bag", image: "/mcq-images/bag.png" },
                    { label: "Umbrella", image: "/mcq-images/umbrella.png" },
                    { label: "Rat", image: "/mcq-images/rat.png" }
                ],
                correctIndex: 1
            }
        ]
    },
    mcq_with_options: {
        questions: [
            {
                question: "What is the capital of India?",
                options: ["Mumbai", "Kolkata", "New Delhi", "Chennai"],
                correctIndex: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctIndex: 1
            },
            {
                question: "How many days are there in a week?",
                options: ["5", "6", "7", "8"],
                correctIndex: 2
            },
            {
                question: "Which animal is called the King of the Jungle?",
                options: ["Tiger", "Elephant", "Lion", "Bear"],
                correctIndex: 2
            },
            {
                question: "What colour are the leaves of a plant?",
                options: ["Red", "Blue", "Yellow", "Green"],
                correctIndex: 3
            },
            {
                question: "Which is the largest ocean in the world?",
                options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
                correctIndex: 2
            }
        ]
    },
    //---------------------------------------------------------------------------
    // Drag & Drop
    dnd_with_img: {
        questions: [
            {
                question: null,
                options: null,
                image: "./DNDdata/images/1.png",
                answer: "tiger"
            },
            {
                question: null,
                options: null,
                image: "./DNDdata/images/2.png",
                answer: "fish"
            },
            {
                question: null,
                options: null,
                image: "./DNDdata/images/3.png",
                answer: "turtle"
            },
            {
                question: null,
                options: null,
                image: "./DNDdata/images/4.png",
                answer: "hen"
            },
            {
                question: null,
                options: null,
                image: "./DNDdata/images/5.png",
                answer: "cat"
            },
            {
                question: null,
                options: null,
                image: "./DNDdata/images/6.png",
                answer: "pigeon"
            },
        ],

        words: ["tiger", "fish", "turtle", "hen", "cat", "pigeon"]
    },
    //---------------------------------------------------------------------------
    // Matching
    matching_image: {
        pairs: [
            {
                id: 1,
                leftImage: "./matching_img_to_img/images/1A.png",
                leftText: "I have bread",
                rightImage: "./matching_img_to_img/images/4B.png",
                rightText: "and butter for breakfast."
            },
            {
                id: 2,
                leftImage: "./matching_img_to_img/images/2A.png",
                leftText: "Mum buys a pen",
                rightImage: "./matching_img_to_img/images/3B.png",
                rightText: "and a notebook."
            },
            {
                id: 3,
                leftImage: "./matching_img_to_img/images/3A.png",
                leftText: "You have a brother",
                rightImage: "./matching_img_to_img/images/1B.png",
                rightText: "and a sister."
            },
            {
                id: 4,
                leftImage: "./matching_img_to_img/images/4A.png",
                leftText: "The carpenter makes a table",
                rightImage: "./matching_img_to_img/images/2B.png",
                rightText: "and a chair."
            }
        ]
    },
    matching_image_3col: {
        pairs: [
            {
                id: 1,
                leftText: "The boy is tired",
                leftImage: "",
                rightText: "he is still running.",
                rightImage: "",
                correctConnector: "but"
            },
            {
                id: 2,
                leftText: "I have crayons",
                leftImage: "",
                rightText: "sketch pens.",
                rightImage: "",
                correctConnector: "and"
            },
            {
                id: 3,
                leftText: "Do you want warm",
                leftImage: "",
                rightText: "cold water?",
                rightImage: "",
                correctConnector: "or"
            },
            {
                id: 4,
                leftText: "It is hot",
                leftImage: "",
                rightText: "sunny today.",
                rightImage: "",
                correctConnector: "and"
            },
            {
                id: 5,
                leftText: "My dress is old",
                leftImage: "",
                rightText: "it is beautiful",
                rightImage: "",
                correctConnector: "but"
            }
        ],

        connectors: ["and", "or", "but"]
    },
    matching_text_number: {
        title: "Match.",
        backgroundImage: "",

        items: [
            { number: 1, image: "./images/1.png" },
            { number: 2, image: "./images/2.png" },
            { number: 3, image: "./images/3.png" },
            { number: 4, image: "./images/4.png" },
            { number: 5, image: "./images/5.png" },
            { number: 6, image: "./images/6.png" }
        ],

        options: [
            { id: "a", text: "pigeon", correctNumber: 6 },
            { id: "b", text: "hen", correctNumber: 4 },
            { id: "c", text: "cat", correctNumber: 5 },
            { id: "d", text: "fish", correctNumber: 2 },
            { id: "e", text: "tiger", correctNumber: 1 },
            { id: "f", text: "turtle", correctNumber: 3 }
        ]
    },
    //---------------------------------------------------------------------------
    underline_words: {
        questions: [
            {
                sentence: "Shreya lives in mumbai.",
                underlinedWord: "mumbai",
                correctAnswer: "Mumbai"
            },
            {
                sentence: "Neema buys two pen.",
                underlinedWord: "pen",
                correctAnswer: "pens"
            },
            {
                sentence: "We live in a small Village.",
                underlinedWord: "Village",
                correctAnswer: "village"
            },
            {
                sentence: "Sahil buys one books.",
                underlinedWord: "books",
                correctAnswer: "book"
            },
            {
                sentence: "ruchika has many crayons.",
                underlinedWord: "ruchika",
                correctAnswer: "Ruchika"
            },
            {
                sentence: "Elly is the name of this Elephant.",
                underlinedWord: "Elephant",
                correctAnswer: "elephant"
            },
            {
                sentence: "Farah is in odisha.",
                underlinedWord: "odisha",
                correctAnswer: "Odisha"
            },
            {
                sentence: "Let us play with three doll.",
                underlinedWord: "doll",
                correctAnswer: "dolls"
            }
        ]
    },
    true_or_false: {
        title: "Read the statements. Select True or False.",
        questions: [
            {
                statement: "Tarun is sad because he gets a new bag.",
                correctAnswer: "False"
            },
            {
                statement: "Tarun's new bag is bright blue with a smiling dinosaur on it.",
                correctAnswer: "True"
            },
            {
                statement: "During recess, Tarun finds his juice box has leaked inside his bag.",
                correctAnswer: "True"
            },
            {
                statement: "Tarun uses an old cloth to clean his bag.",
                correctAnswer: "False"
            },
            {
                statement: "Tarun decides to be more careful with his juice next time.",
                correctAnswer: "True"
            }
        ]
    },

};