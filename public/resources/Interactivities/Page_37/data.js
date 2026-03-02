window.QUIZ_DATA = {
    title: "C. Colour the correct answer.",
    type: "underline-words",
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

    fib_with_img: {
        backgroundImage: "NULL",
        title: "Complete using vowels.",
        wordBank: [],
        questions: [
            {
                id: 1,
                image: "./images/1.png",
                placeholder: "s t _ r",
                blanks: "a",
                answer: "star"
            },
            {
                id: 2,
                image: "./images/2.png",
                placeholder: "m _ l k",
                blanks: "i",
                answer: "milk"
            },
            {
                id: 3,
                image: "./images/3.png",
                placeholder: "d r _ m",
                blanks: "u",
                answer: "drum"
            },
            {
                id: 4,
                image: "./images/4.png",
                placeholder: "b _ _",
                blanks: "ee",
                answer: "bee"
            },
            {
                id: 5,
                image: "./images/5.png",
                placeholder: "b _ _ t",
                blanks: "oa",
                answer: "boat"
            },
            {
                id: 6,
                image: "./images/6.png",
                placeholder: "s n _ _ l",
                blanks: "ai",
                answer: "snail"
            },
            {
                id: 7,
                image: "./images/7.png",
                placeholder: "p _ n c _ l",
                blanks: "ei",
                answer: "pencil"
            },
            {
                id: 8,
                image: "./images/8.png",
                placeholder: "b _ c k _ t",
                blanks: "ue",
                answer: "bucket"
            },
            {
                id: 9,
                image: "./images/9.png",
                placeholder: "c l _ _ d",
                blanks: "ou",
                answer: "cloud"
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
        title: "Write.",
        wordBox: ["they", "we", "they", "you", "they"],

        questions: [
            {
                id: 1,
                original: "keys, apples, chairs",
                after: "",
                answer: "they"
            },
            {
                id: 2,
                original: "my family and I, my friends and I, Sakshi and I",
                after: "",
                answer: "we"
            },
            {
                id: 3,
                original: "horses, cows, dogs",
                after: "",
                answer: "they"
            },
            {
                id: 4,
                original: "the girls, Amar and Nikhil, the teachers",
                after: "",
                answer: "they"
            },
            {
                id: 5,
                original: "You and Mummy, Grandma and you, You, Anil and Pakhi",
                after: "",
                answer: "you"
            }
        ]
    },
    fib_alphabet: {
        title: "Fill in the missing letters.",
        letters: [
            "a", "b", "c", "d", "_", "f", "g", "h", "_", "j", "k", "l", "m",
            "n", "_", "p", "q", "r", "s", "t", "_", "v", "w", "x", "y", "z"
        ],
        answers: {
            4: "e",
            8: "i",
            14: "o",
            20: "u"
        }
    },
    Fib_Simple_Image: {
        title: "Write.",
        wordBox: [
            "she",
            "I",
            "you",
            "he",
            "it"
        ],
        questions: [
            {
                id: 1,
                image: "./images/1.png",   // boy pointing at girl
                answer: "you"
            },
            {
                id: 2,
                image: "./images/2.png",   // girl holding skateboard
                answer: "it"
            },
            {
                id: 3,
                image: "./images/3.png",   // girl pointing to herself
                answer: "I"
            },
            {
                id: 4,
                image: "./images/4.png",   // boy (he)
                answer: "he"
            },
            {
                id: 5,
                image: "./images/5.png",   // girl (she)
                answer: "she"
            }
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
        title: "Highlight the correct words.",

        questions: [
            {
                // 1. The boy and the girl are in the park.
                words: ["The", "boy", "and", "the", "girl", "are", "in", "the", "park."],
                correctIndices: [1, 4, 8] // boy, girl, park.
            },
            {
                // 2. Cats miaow.
                words: ["Cats", "miaow."],
                correctIndices: [0] // Cats
            },
            {
                // 3. I keep the water in the pot.
                words: ["I", "keep", "the", "water", "in", "the", "pot."],
                correctIndices: [3, 6] // water, pot.
            },
            {
                // 4. Dad makes soup.
                words: ["Dad", "makes", "soup."],
                correctIndices: [0, 2] // Dad, soup.
            },
            {
                // 5. We like apples and bananas.
                words: ["We", "like", "apples", "and", "bananas."],
                correctIndices: [2, 4] // apples, bananas.
            },
            {
                // 6. Your house is big.
                words: ["Your", "house", "is", "big."],
                correctIndices: [1] // house
            }
        ]
    },
    mcq_with_images: {
        title: "Choose the correct answers.",
        questions: [
            {
                id: 1,
                image: "./images/1.png",
                options: ["a", "b", "c", "d"],
                correctIndices: [0, 3]
            },
            {
                id: 2,
                image: "./images/2.png",
                options: ["a", "b", "c", "d"],
                correctIndices: [1, 3]
            },
            {
                id: 3,
                image: "./images/3.png",
                options: ["a", "b", "c", "d"],
                correctIndices: [0, 2]
            },
            {
                id: 4,
                image: "./images/4.png",
                options: ["a", "b", "c", "d"],
                correctIndices: [2, 3]
            }
        ]
    },
    mcq_with_options: {
        questions: [
            {
                question: "There is a plate. __________ is white in colour.",
                options: ["It", "You"],
                correctIndex: 0
            },
            {
                question: "Shreya is my sister. __________ likes drawing.",
                options: ["You", "She"],
                correctIndex: 1
            },
            {
                question: "My name is Unni. __________ am seven years old.",
                options: ["I", "She"],
                correctIndex: 0
            },
            {
                question: "Harsh is my brother. __________ studies in my class.",
                options: ["She", "He"],
                correctIndex: 1
            },
            {
                question: "You and Maria are sisters. Maria dances well. __________ sing well.",
                options: ["She", "You"],
                correctIndex: 1
            }
        ]
    },
    mcq_sentence_slash: {
        title: "Choose the correct answer.",
        questions: [
            {
                id: 1,
                text: "Are those your pens? We / They are on the table.",
                options: ["We", "They"],
                correctIndex: 1
            },
            {
                id: 2,
                text: "You and Faiz are friends. You / They study together.",
                options: ["You", "They"],
                correctIndex: 0
            },
            {
                id: 3,
                text: "Simran and I are friends. We / You live on the same street.",
                options: ["We", "You"],
                correctIndex: 0
            },
            {
                id: 4,
                text: "Papa and Mummy go for a walk. You / They walk every morning.",
                options: ["You", "They"],
                correctIndex: 1
            },
            {
                id: 5,
                text: "The cows live on the farm. You / They eat grass.",
                options: ["You", "They"],
                correctIndex: 1
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
        title: "Underline the describing words.",
        questions: [
            {
                id: 1,
                sentence: "Anisha has a blue bag.",
                underlinedWords: ["blue"]
            },
            {
                id: 2,
                sentence: "Saini has three toffees for her friends.",
                underlinedWords: ["three"]
            },
            {
                id: 3,
                sentence: "Look at the big balloon in the blue sky.",
                underlinedWords: ["big", "blue"]
            },
            {
                id: 4,
                sentence: "I have a long dress.",
                underlinedWords: ["long"]
            },
            {
                id: 5,
                sentence: "Garima drinks water from a small bottle.",
                underlinedWords: ["small"]
            },
            {
                id: 6,
                sentence: "Harsh puts the round watch in a box.",
                underlinedWords: ["round"]
            },
            {
                id: 7,
                sentence: "Manita gives her mother a beautiful flower.",
                underlinedWords: ["beautiful"]
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




    //EXTRA-----

    match_activity: {
        backgroundImage: "./images/1.png",
        title: "Match.",
        leftItems: [
            { id: 1, label: "dog" },
            { id: 2, label: "cat" },
            { id: 3, label: "hat" },
            { id: 4, label: "igloo" },
            { id: 5, label: "umbrella" },
            { id: 6, label: "egg" },
            { id: 7, label: "apple" },
            { id: 8, label: "orange" },
            { id: 9, label: "banana" }
        ],
        rightItems: [
            { letter: "a", text: "orange", correctMatch: 8 },
            { letter: "b", text: "apple", correctMatch: 7 },
            { letter: "c", text: "cat", correctMatch: 2 },
            { letter: "d", text: "egg", correctMatch: 6 },
            { letter: "e", text: "dog", correctMatch: 1 },
            { letter: "f", text: "umbrella", correctMatch: 5 },
            { letter: "g", text: "igloo", correctMatch: 4 },
            { letter: "h", text: "hat", correctMatch: 3 },
            { letter: "i", text: "banana", correctMatch: 9 }
        ]
    }







};