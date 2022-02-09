export const issues = {
    "The Age Old Question": {
        "save": [],
        "description": "Recently, a challege has been proposed to your doorstep. The Treaty of @city has been keeping the @nation united, however multiple vulnerabilities has been found with the ancient wordings of the treaty, which makes Alphadonia more currupt and it has a chance of breaking.",
        "choices": {
            "Rewrite": {
                "message": "'We should rewrite the treaty, since it's crucial to our survival.' says patriot @name. 'It worked before, so it should work again.'",
                "aftermath": "The treaty has been rewritten, and nothing has been solved.",
                "economy": 0,
                "government": -0.05,
                "relationships": {}
            },
            "Ignore": {
                "message": "'How about this: the treaty is flawed, and no sense of rewriting can keep it from breaking down.' says Minister of Interior Affairs @name. 'We should just ignore it, and hope for the best.'",
                "aftermath": "The treaty has been ignored, and nothing has been solved.",
                "economy": 0,
                "government": 0,
                "relationships": {}
            },
            "New Treaty": {
                "message": "'I have heard that the treaty is flawed and this is due to lack of consensus within all entities in the nation.' says child-politician @name. 'We should create a new treaty, with everyone contributing to this.'",
                "aftermath": "The Treaty of @city has been written.",
                "economy": 0.25,
                "government": 0.25,
                "relationships": {}
            }
        }
    },
    "Diplomatic Hiccups": {
        "save": ["randnation"],
        "description": "Recently, spies has been found which have an allegence with @randnation. Diplomatic hiccups happen, and the @nation is in a state of crisis.",
        "choices": {
            "Cut Ties": {
                "message": "'We should cut the ties with @randnation, since it's not fair to us!' says your kid @name. 'They are evil and they spied on us!'",
                "aftermath": "The diplomatic ties with @randnation have been cut.",
                "economy": 0,
                "government": -0.25,
                "relationships": {
                    "@randnation": -0.25
                }
            },
            "Status Quo": {
                "message": "'Maybe let it be, and calm down.' says your friend @name. 'Maybe they were suspicious or hunting for terrorists affecting them. Don't think of every single thing as a national crime.'",
                "aftermath": "It's illegal to break up with toxic partners",
                "economy": 0,
                "government": 0.1,
                "relationships": {
                    "@randnation": 0.1
                }
            }
        }
    }
}