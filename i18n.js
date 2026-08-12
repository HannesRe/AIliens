(() => {
  const STORAGE_KEY = "ai_fake_gamesurvey_language";
  const SUPPORTED_LANGUAGES = ["en", "de"];
  let currentLanguage = "en";

  const translations = {
    en: {
      "language.label": "Language",
      "language.en": "English",
      "language.de": "German",
      "index.title": "REAL or FAKE?",
      "index.subtitle": "Can you spot AI-generated images?",
      "index.agentMessage": "Hello Agent,<br>Aliens from the Gemini constellation are trying to take over Earth. They disguise themselves as humans and are hard to tell apart. That is why all agents must complete this training as quickly as possible. Are you ready to save Earth?",
      "index.playNow": "PLAY NOW",
      "index.howToPlay": "HOW TO PLAY",
      "index.aboutUs": "About Us",
      "dialog.title": "MISSION BRIEF",
      "dialog.subtitle": "The agent explains the scenario before you register",
      "dialog.agentMessage": "Hello Agent,<br>Aliens from the Gemini constellation are trying to take over Earth. They disguise themselves as humans and are hard to tell apart. That is why all agents must complete this training as quickly as possible. Are you ready to save Earth?",
      "dialog.continue": "CONTINUE",
      "about.title": "ABOUT US",
      "about.subtitle": "Learn more about our project",
      "about.mission.title": "Our Mission",
      "about.mission.body": "The \"Real or Fake?\" AI Challenge aims to inform and engage people in understanding AI-generated images. As AI technology continues to advance, it is increasingly important for everyone to develop the skills needed to identify AI-generated content. Through this interactive quiz, we help people learn to spot the subtle differences between real photographs and AI-created images.",
      "about.why.title": "Why This Matters",
      "about.why.body": "With the rapid advancement of AI technology, deepfakes and AI-generated images are becoming more and more realistic. Our research helps us understand how people perceive and interact with AI-generated content. Your participation contributes valuable insights into human perception and AI literacy in the digital age.",
      "about.help.title": "How You Help",
      "about.help.item1": "Your decisions help train models to understand human perception",
      "about.help.item2": "You contribute to research on AI literacy and detection capabilities",
      "about.help.item3": "The collected data helps improve AI detection techniques",
      "about.help.item4": "Your feedback helps shape the future of AI transparency",
      "about.research.title": "Our Research",
      "about.research.body": "This project is part of ongoing research into human-AI interaction and the effectiveness of AI detection methods. All data is collected with your consent and handled according to strict privacy standards. We analyze patterns in how people identify AI images before and after receiving guidance on detection techniques.",
      "about.back": "BACK",
      "tutorial.title": "HOW TO PLAY",
      "tutorial.subtitle": "A short guide before you start",
      "tutorial.step1.title": "Start the Quiz",
      "tutorial.step1.body": "Before you can begin, we need your approximate age and a few other details. <span style=\"color: #e52e71;\">*</span>",
      "tutorial.step2.title": "Analyze the Images",
      "tutorial.step2.body": "You will be shown pictures of people. Decide whether you think they are real photographs or AI-generated images. Select the appropriate button. Please also tell us how sure you are using the slider.",
      "tutorial.step3.title": "Training",
      "tutorial.step3.body": "You will then receive a short tutorial on how to better recognize AI images.",
      "tutorial.step4.title": "Test Your Newly Acquired Skills",
      "tutorial.step4.body": "Please use your newly acquired knowledge to reassess whether the portraits are AI-generated.",
      "tutorial.expect.title": "What to Expect",
      "tutorial.expect.body": "This game is part of a survey conducted by the SES laboratory at OTH Regensburg. With this game, we want to measure how well AI-generated images can be distinguished from real ones. To differentiate these statistics by age, we need to know your age. If you would like to know more about this project, click <a href=\"about.html\" style=\"color: #e52e71; text-decoration: none; font-weight: 600;\">here</a>.",
      "tutorial.back": "BACK",
      "tutorial.play": "START PLAYING",
      "form.title": "Enter Your Details",
      "form.agentMessage": "Agent, please confirm your details to access the mission.",
      "form.playedBefore": "I have played this game before",
      "form.ageLabel": "Select Your Age Group: <span class=\"required\">*</span>",
      "form.shortGame": "Short Game",
      "form.longGame": "Long Game",
      "quiz.phase1.agentMessage": "Let's see how good your instincts are. Are there real people in the following images?",
      "quiz.phase2.agentMessage": "Give it your best again, Agent.",
      "quiz.real": "Real",
      "quiz.fake": "Fake",
      "quiz.confidence": "Confidence",
      "quiz.next": "Next",
      "quiz.sendingData": "Sending data...",
      "quiz.timeLeft": "Time Left",
      "quiz.reviewTitle": "Review Your Answers",
      "quiz.reviewSubtitle": "Check your answers before submitting. You can change any answer.",
      "quiz.questionLabel": "Question",
      "quiz.yourAnswerPrefix": "Your answer:",
      "quiz.notAnsweredYet": "Not answered yet",
      "quiz.noConfidenceLevel": "No confidence level",
      "quiz.changeToReal": "Change to Real",
      "quiz.changeToFake": "Change to Fake",
      "quiz.submitFinalAnswers": "Submit Final Answers",
      "quiz.completeTitle": "Quiz Complete!",
      "quiz.scoreLabel": "Score",
      "quiz.timeTaken": "Time Taken",
      "quiz.playAgain": "Play Again",
      "quiz.confidenceLabel": "Confidence",
      "summary.title": "Phases Overview",
      "summary.subtitle": "Results from Quiz Phase 1, Training and Quiz Phase 2",
      "summary.phase1": "Phase 1 Quiz",
      "summary.training": "Training",
      "summary.phase2": "Phase 2 Quiz",
      "summary.noData": "No data",
      "summary.correctSuffix": "correct",
      "summary.totalLabel": "Total",
      "summary.home": "Back to Start",
      "summary.learnMore": "Learn more about image generation",
      "summary.agentMessage": "Well done, Agent!\nWith your new knowledge, the AI-liens no longer pose a threat to you or Earth. Stay alert, though.",
      "learning.title": "Image Learning Center",
      "learning.card1.title": "Detect Fake Photos",
      "learning.card1.body": "Learn techniques to identify manipulated images.",
      "learning.card2.title": "Photo Ethics",
      "learning.card2.body": "Understand the ethical considerations in image editing.",
      "learning.card3.title": "Editing Tools",
      "learning.card3.body": "Discover tools used to create fake photos.",
      "learning.card4.title": "Manipulation History",
      "learning.card4.body": "Explore how photo manipulation has evolved.",
      "learning.section1.title": "How to Detect Fake Photos",
      "learning.section1.body": "Here are some techniques to help identify manipulated images:",
      "learning.section1.item1": "Check the edges: Look for blurry or irregular edges around objects.",
      "learning.section1.item2": "Examine shadows: Inconsistent shadow directions can reveal manipulation.",
      "learning.section1.item3": "Look for pixelation: Edited areas may show unusual pixel patterns.",
      "learning.section1.item4": "Check metadata: Image metadata can sometimes reveal the editing software used.",
      "learning.section1.item5": "Reverse image search: Search for the image online to find original versions.",
      "learning.section2.title": "Photo Ethics",
      "learning.section2.body": "Photo manipulation raises important ethical questions:",
      "learning.section2.item1": "Journalism: News photos should never be manipulated in ways that change their meaning.",
      "learning.section2.item2": "Advertising: Many countries have regulations about digital alterations.",
      "learning.section2.item3": "Social media: Filters and edits can create unrealistic beauty standards.",
      "learning.section2.item4": "Historical photos: Altering historical images can distort our understanding of the past.",
      "learning.section3.title": "Common Editing Tools",
      "learning.section3.body": "These are some of the most frequently used tools for photo manipulation:",
      "learning.section3.item1": "Adobe Photoshop: The industry standard for professional image editing.",
      "learning.section3.item2": "GIMP: A free and open-source alternative to Photoshop.",
      "learning.section3.item3": "FaceApp: Specializes in facial transformations and aging effects.",
      "learning.section3.item4": "Deepfake software: Uses AI to create realistic face swaps in videos.",
      "learning.section3.item5": "Lightroom: Primarily for color correction but can also be used for manipulation.",
      "learning.section4.title": "History of Photo Manipulation",
      "learning.section4.body": "Photo manipulation is nearly as old as photography itself:",
      "learning.section4.item1": "1800s: Early photographers created \"spirit photos\" by combining negatives.",
      "learning.section4.item2": "1920s-30s: Stalin's regime altered photos to remove purged officials.",
      "learning.section4.item3": "1980s: Digital editing began with programs like Photoshop.",
      "learning.section4.item4": "2000s: Social media made photo filters widely accessible.",
      "learning.section4.item5": "2010s to present: AI-powered tools made manipulation more sophisticated.",
      "learning.back": "Back to Start",
      "impressum.title": "Legal Notice",
      "impressum.subtitle": "Legal information and contact details",
      "impressum.section1.title": "Provider Information",
      "impressum.section1.body": "This website is provided as part of an academic research project on AI perception and detection. The project is conducted with strict adherence to research ethics guidelines and data protection regulations.",
      "impressum.section2.title": "Data Protection",
      "impressum.section2.item1": "All personal data is processed with your explicit consent",
      "impressum.section2.item2": "We comply with GDPR and other applicable data protection laws",
      "impressum.section2.item3": "Data is stored securely and used only for research purposes",
      "impressum.section2.item4": "You have the right to access, correct, or delete your data",
      "impressum.section2.item5": "We do not share your data with third parties without permission",
      "impressum.section3.title": "Liability Disclaimer",
      "impressum.section3.body": "This website and the AI Challenge are provided \"as is\" without any warranties. We are not liable for any damages or losses resulting from the use of this platform or its content. The accuracy of the quiz results reflects our current understanding of AI detection at the time of creation.",
      "impressum.section4.title": "Contact & Support",
      "impressum.section4.body": "If you have any questions, concerns, or requests regarding your data, please contact us using the email address provided in the research information. We are committed to addressing any questions or concerns you may have about this project.",
      "impressum.section5.title": "Copyright",
      "impressum.section5.body": "All content on this website is protected by copyright. Using this website and participating in the quiz constitutes your agreement to the terms and conditions outlined here. Unauthorized reproduction or distribution of any content is prohibited.",
      "impressum.back": "BACK",
      "training.phase1.title": "Training Phase 1",
      "training.phase1.subtitle": "The Face",
      "training.phase1.step1.title": "Lighting, Shadows, and Reflections",
      "training.phase1.step1.body": "Check whether the lighting is even and whether the shadows match. Do all reflections fit the lighting conditions?",
      "training.phase1.step2.title": "Details",
      "training.phase1.step2.body": "Do the teeth, eyes, and skin have clearly defined details and contours, or do they look blurry and distorted?",
      "training.phase1.step3.title": "Symmetry",
      "training.phase1.step3.body": "Are features such as eyes and ears symmetrical?",
      "training.phase1.step4.title": "Transition",
      "training.phase1.step4.body": "Does the hair fall naturally? Does it separate clearly from the background? Does it behave naturally or pass through the ears, for example?",
      "training.phase1.start": "Start Phase 1",
      "training.phase1.agentMessage": "Our research team has discovered weaknesses in the aliens' technology that can help you. Let's begin with techniques that focus on the face.",
      "training.phase2.title": "Phase 2",
      "training.phase2.subtitle": "Background & Textures",
      "training.phase2.step1.title": "Swirls",
      "training.phase2.step1.body": "Look for unnatural or distorted shapes that might indicate artificial creation, especially at the transition to the foreground.",
      "training.phase2.step2.title": "Textures",
      "training.phase2.step2.body": "Do the textures of fabric and other materials in the background look real, or do they look distorted or blurry?",
      "training.phase2.step3.title": "Consistency in Lines and Shapes",
      "training.phase2.step3.body": "Are shapes in the background consistent? Do they continue straight from one side to the other? Do angles stay the same?",
      "training.phase2.start": "Start Phase 2",
      "training.phase2.agentMessage": "Well done. Look for clues in the background and transition areas to help distinguish AI-generated content.",
      "training.hintButton": "Hint",
      "training.continue": "Continue",
      "training.result.correct": "Correctly identified.",
      "training.result.incorrectPrefix": "Wrong. The person was:",
      "training.result.explanation": "Explanation:",
      "training.hintPrefix": "Hint:",
      "training.complete.title": "Training Complete",
      "training.complete.correct": "Correct",
      "training.complete.accuracy": "Accuracy",
      "training.complete.goQuiz": "Go to Quiz",
      "training.item1.explanation": "AI struggles to create consistent lighting and reflections, for example in the eyes. Teeth are also inconsistent.",
      "training.item1.hint": "Focus on the teeth and compare all eyes.",
      "training.item2.explanation": "Reflections and shadows are consistent. The shape of the ears is symmetrical and natural. Skin texture looks natural and detailed.",
      "training.item2.hint": "Are the ears symmetrical? Are there consistent shadows and reflections in the eyes? Does the skin look natural?",
      "training.item3.explanation": "The eyes have different lighting. The ears are asymmetrical and the skin is blurry and lacks natural detail.",
      "training.item3.hint": "Are the lighting and reflections consistent? Are the ears and face symmetrical? Are there clear natural details in the skin?",
      "training.item4.explanation": "There is a clear transition between the fine hair and the background. The lines in the background are straight and consistent.",
      "training.item4.hint": "Are the lines in the background straight and consistent? Is there a clear separation between foreground and background?",
      "training.item5.explanation": "The shapes in the background are warped and blurred. There are no consistent lines or other details. Unnatural colors are also used.",
      "training.item5.hint": "Does the background make sense? Do the shapes look natural?",
      "training.item6.explanation": "The background lacks consistency. The right part of the image makes no sense.",
      "training.item6.hint": "Does the background feel natural and make sense?",
      "training.defaultMessage": "Analyze the image carefully - Is it real or fake?",
      "training.finished.agentMessage": "You have successfully completed the training phase. With your instincts and newly acquired knowledge, you can now proceed to the second quiz phase. Good luck, Agent!",
    },
    de: {
      "language.label": "Sprache",
      "language.en": "English",
      "language.de": "Deutsch",
      "index.title": "REAL or FAKE?",
      "index.subtitle": "Kannst du KI-generierte Bilder erkennen?",
      "index.playNow": "JETZT SPIELEN",
      "index.howToPlay": "ANLEITUNG",
      "index.aboutUs": "Über uns",
      "dialog.agentMessage": "Hallo Agent,<br>AI-Liens aus dem Sternbild Gemini versuchen, die Erde zu übernehmen. Sie nutzen moderne KI-Software und tarnen sich damit als Menschen. Sie sind schwer von uns echten Menschenzu unterscheiden. Deshalb müssen Sie dieses Training so schnell wie möglich absolvieren, um dieser Bedrohung gewappnet zu sein",
      "dialog.continue": "WEITER",
      "about.title": "ÜBER UNS",
      "about.subtitle": "Mehr über unser Projekt",
      "about.mission.title": "Unsere Mission",
      "about.mission.body": "Der \"Real or Fake?\" AI Challenge soll Menschen über KI-generierte Bilder informieren und sie dafür sensibilisieren. Wir sind überzeugt, dass es immer wichtiger wird, die Fähigkeit zu entwickeln, KI-generierte Inhalte zu erkennen. Mit diesem interaktiven Quiz helfen wir dabei, die feinen Unterschiede zwischen echten Fotos und KI-erzeugten Bildern zu erkennen.",
      "about.why.title": "Warum das wichtig ist",
      "about.why.body": "Mit dem rasanten Fortschritt der KI-Technologie werden Deepfakes und KI-generierte Bilder immer realistischer. Unsere Forschung hilft uns zu verstehen, wie Menschen KI-generierte Inhalte wahrnehmen und damit umgehen. Deine Teilnahme liefert wertvolle Erkenntnisse über menschliche Wahrnehmung und KI-Kompetenz im digitalen Zeitalter.",
      "about.research.title": "Unsere Forschung",
      "about.research.body": "Dieses Projekt ist Teil laufender Forschung zu Mensch-KI-Interaktion und der Wirksamkeit von Methoden zur KI-Erkennung. Alle Daten werden mit deiner Zustimmung erfasst und nach strengen Datenschutzstandards behandelt. Wir analysieren Muster darin, wie Menschen KI-Bilder vor und nach Hinweisen auf Erkennungstechniken identifizieren.",
      "about.back": "ZURÜCK",
      "tutorial.title": "SO SPIELST DU",
      "tutorial.subtitle": "Eine kurze Anleitung vor dem Start",
      "tutorial.step1.title": "Starte das Quiz",
      "tutorial.step1.body": "Bevor du beginnen kannst, brauchen wir dein ungefähres Alter und einige weitere Angaben. <span style=\"color: #e52e71;\">*</span>",
      "tutorial.step2.title": "Analysiere die Bilder",
      "tutorial.step2.body": "Du siehst Bilder von Menschen. Entscheide, ob es echte Fotos von Menschen oder KI-generierte Bilder sind. Wähle den passenden Button. Bitte gib uns auch mit dem Regler an, wie sicher du dir bist.",
      "tutorial.step3.title": "Training",
      "tutorial.step3.body": "Danach erhältst du eine kurze Anleitung, wie du KI-Bilder besser erkennen kannst.",
      "tutorial.step4.title": "Teste dein neuerlentes Können",
      "tutorial.step4.body": "Nutze dein neu erworbenes Wissen, um erneut zu beurteilen, ob die Porträts KI-generiert sind.",
      "tutorial.expect.title": "Was dich erwartet",
      "tutorial.expect.body": "Dieses Spiel ist Teil einer Umfrage des SES-Labors an der OTH Regensburg. Mit diesem Spiel wollen wir messen, wie gut sich KI-generierte Bilder von echten unterscheiden lassen. Um diese Statistiken nach Alter zu unterscheiden, benötigen wir dein Alter. Wenn du mehr über dieses Projekt erfahren möchtest, klicke <a href=\"about.html\" style=\"color: #e52e71; text-decoration: none; font-weight: 600;\">hier</a>.",
      "tutorial.back": "ZURÜCK",
      "tutorial.play": "SPIELEN",
      "form.title": "Gib deine Daten ein",
      "form.agentMessage": "Agent, bitte bestätigen Sie Ihre Identität, um die Mission zu starten",
      "form.playedBefore": "Ich habe dieses Spiel schon einmal gespielt",
      "form.ageLabel": "Wähle deine Altersgruppe: <span class=\"required\">*</span>",
      "form.shortGame": "Kurzes Spiel",
      "form.longGame": "Langes Spiel",
      "quiz.phase1.agentMessage": "Schauen wir mal wie gut Ihre Instinkte sind. Sind auf folgenden Bildern echte Menschen zu sehen?",
      "quiz.phase2.agentMessage": "Geben Sie nochmal ihr Bestes, Agent.",
      "quiz.real": "Echt",
      "quiz.fake": "Fake",
      "quiz.confidence": "Überzeugung",
      "quiz.next": "Weiter",
      "quiz.sendingData": "Daten werden gesendet...",
      "quiz.timeLeft": "Verbleibende Zeit",
      "quiz.reviewTitle": "Überprüfe deine Antworten",
      "quiz.reviewSubtitle": "Überprüfe deine Antworten vor dem Absenden. Du kannst jede Antwort ändern.",
      "quiz.questionLabel": "Frage",
      "quiz.yourAnswerPrefix": "Deine Antwort:",
      "quiz.notAnsweredYet": "Noch nicht beantwortet",
      "quiz.noConfidenceLevel": "Kein Sicherheitswert",
      "quiz.changeToReal": "Zu Echt ändern",
      "quiz.changeToFake": "Zu Fake ändern",
      "quiz.submitFinalAnswers": "Endgültige Antworten absenden",
      "quiz.completeTitle": "Quiz abgeschlossen!",
      "quiz.scoreLabel": "Punktzahl",
      "quiz.timeTaken": "Benötigte Zeit",
      "quiz.playAgain": "Nochmal spielen",
      "quiz.confidenceLabel": "Sicherheit",
      "summary.title": "Phasenübersicht",
      "summary.subtitle": "Ergebnisse aus Quiz Phase 1, Training und Quiz Phase 2",
      "summary.phase1": "Quiz Phase 1",
      "summary.training": "Training",
      "summary.phase2": "Quiz Phase 2",
      "summary.noData": "Keine Daten",
      "summary.correctSuffix": "korrekt",
      "summary.totalLabel": "Gesamt",
      "summary.home": "Zurück zum Start",
      "summary.learnMore": "Mehr über Bildgenerierung erfahren",
      "summary.agentMessage": " Sehr gut gemacht, Agent! \n Mit Ihren neuen Fahigkeiten stellt die Technologie der AI-liens keine Bedrohung mehr für Sie oder für die Erde dar. Aber bleiben Sie dennoch wachsam!",
      "learning.title": "Foto-Lernzentrum",
      "learning.card1.title": "Falsche Fotos erkennen",
      "learning.card1.body": "Lerne Techniken, um manipulierte Bilder zu identifizieren.",
      "learning.card2.title": "Foto-Ethik",
      "learning.card2.body": "Verstehe ethische Fragen bei der Bildbearbeitung.",
      "learning.card3.title": "Bearbeitungswerkzeuge",
      "learning.card3.body": "Entdecke Werkzeuge, mit denen gefälschte Fotos erstellt werden.",
      "learning.card4.title": "Geschichte der Manipulation",
      "learning.card4.body": "Erfahre, wie sich Bildmanipulation entwickelt hat.",
      "learning.section1.title": "So erkennst du falsche Fotos",
      "learning.section1.body": "Hier sind einige Techniken, mit denen du manipulierte Bilder erkennen kannst:",
      "learning.section1.item1": "Ränder prüfen: Achte auf verschwommene oder unregelmäßige Kanten um Objekte herum.",
      "learning.section1.item2": "Schatten untersuchen: Unstimmige Schattenrichtungen können Manipulation verraten.",
      "learning.section1.item3": "Auf Pixelbildung achten: Bearbeitete Bereiche zeigen manchmal ungewöhnliche Pixelmuster.",
      "learning.section1.item4": "Metadaten prüfen: Bildmetadaten verraten manchmal die verwendete Bearbeitungssoftware.",
      "learning.section1.item5": "Rückwärtssuche nutzen: Suche online nach dem Bild, um Originalversionen zu finden.",
      "learning.section2.title": "Foto-Ethik",
      "learning.section2.body": "Bildmanipulation wirft wichtige ethische Fragen auf:",
      "learning.section2.item1": "Journalismus: Nachrichtenfotos sollten niemals so manipuliert werden, dass sich ihre Bedeutung verändert.",
      "learning.section2.item2": "Werbung: In vielen Ländern gibt es Regeln für digitale Veränderungen.",
      "learning.section2.item3": "Soziale Medien: Filter und Bearbeitungen können unrealistische Schönheitsideale erzeugen.",
      "learning.section2.item4": "Historische Fotos: Das Verändern historischer Bilder kann unser Verständnis der Vergangenheit verfälschen.",
      "learning.section3.title": "Gängige Bearbeitungswerkzeuge",
      "learning.section3.body": "Das sind einige der am häufigsten verwendeten Werkzeuge für Bildmanipulation:",
      "learning.section3.item1": "Adobe Photoshop: Der Branchenstandard für professionelle Bildbearbeitung.",
      "learning.section3.item2": "GIMP: Eine kostenlose Open-Source-Alternative zu Photoshop.",
      "learning.section3.item3": "FaceApp: Spezialisiert auf Gesichtsveränderungen und Alterungseffekte.",
      "learning.section3.item4": "Deepfake-Software: Nutzt KI, um realistische Face-Swaps in Videos zu erstellen.",
      "learning.section3.item5": "Lightroom: Vor allem für Farbkorrektur, kann aber auch für Manipulation genutzt werden.",
      "learning.section4.title": "Geschichte der Bildmanipulation",
      "learning.section4.body": "Bildmanipulation ist fast so alt wie die Fotografie selbst:",
      "learning.section4.item1": "1800er: Frühe Fotografen erzeugten \"Geisterfotos\" durch das Kombinieren von Negativen.",
      "learning.section4.item2": "1920er-30er: Stalins Regime veränderte Fotos, um gesäuberte Funktionäre zu entfernen.",
      "learning.section4.item3": "1980er: Digitale Bildbearbeitung begann mit Programmen wie Photoshop.",
      "learning.section4.item4": "2000er: Soziale Medien machten Fotofilter weithin zugänglich.",
      "learning.section4.item5": "2010er bis heute: KI-gestützte Werkzeuge machten Manipulation immer raffinierter.",
      "learning.back": "Zurück zur Startseite",
      "impressum.title": "Impressum",
      "impressum.subtitle": "Rechtliche Hinweise und Kontaktdaten",
      "impressum.section1.title": "Angaben zum Anbieter",
      "impressum.section1.body": "Diese Website ist Teil eines akademischen Forschungsprojekts zur Wahrnehmung und Erkennung von KI. Das Projekt wird unter strikter Beachtung von Forschungsethik und Datenschutzrichtlinien durchgeführt.",
      "impressum.section2.title": "Datenschutz",
      "impressum.section2.item1": "Alle personenbezogenen Daten werden nur mit deiner ausdrücklichen Zustimmung verarbeitet",
      "impressum.section2.item2": "Wir halten uns an die DSGVO und andere anwendbare Datenschutzgesetze",
      "impressum.section2.item3": "Daten werden sicher gespeichert und nur für Forschungszwecke verwendet",
      "impressum.section2.item4": "Du hast das Recht, auf deine Daten zuzugreifen, sie zu berichtigen oder zu löschen",
      "impressum.section2.item5": "Wir geben deine Daten nicht ohne Erlaubnis an Dritte weiter",
      "impressum.section3.title": "Haftungsausschluss",
      "impressum.section3.body": "Diese Website und die AI Challenge werden \"wie besehen\" ohne Gewährleistung bereitgestellt. Wir haften nicht für Schäden oder Verluste, die durch die Nutzung dieser Plattform oder ihrer Inhalte entstehen. Die Genauigkeit der Quiz-Ergebnisse entspricht unserem Kenntnisstand zur Zeit der Erstellung.",
      "impressum.section4.title": "Kontakt & Support",
      "impressum.section4.body": "Bei Fragen, Anliegen oder Anfragen zu deinen Daten kontaktiere uns bitte über die in den Forschungsinformationen angegebene E-Mail-Adresse. Wir bemühen uns, alle Fragen oder Anliegen zu diesem Projekt zu beantworten.",
      "impressum.section5.title": "Urheberrecht",
      "impressum.section5.body": "Alle Inhalte dieser Website sind urheberrechtlich geschützt. Die Nutzung dieser Website und die Teilnahme am Quiz bedeuten, dass du den hier genannten Bedingungen zustimmst. Eine unerlaubte Vervielfältigung oder Verbreitung von Inhalten ist untersagt.",
      "impressum.back": "ZURÜCK",
      "training.phase1.title": "Trainingsphase 1",
      "training.phase1.subtitle": "Das Gesicht",
      "training.phase1.step1.title": "Licht, Schatten und Reflexionen",
      "training.phase1.step1.body": "Kontrolliere, ob die Lichteinstrahlung gleichmäßig ist, und die Schatten dazu passen. Passen alle Reflexionen zu den Lichtverhältnissen?",
      "training.phase1.step2.title": "Details",
      "training.phase1.step2.body": "Haben Zähne, Augen und Haut klar definierte Details und Konturen oder wirken sie verschwommen und verzogen?",
      "training.phase1.step3.title": "Symmetrie",
      "training.phase1.step3.body": "Sind Merkmale wie Augen und Ohren symmetrisch?",
      "training.phase1.step4.title": "Übergang",
      "training.phase1.step4.body": "Fallen die Haare natürlich? Trennen sie sich klar vom Hintergrund? Verhalten sie sich natürlich oder gehen sie z. B. durch die Ohren?",
      "training.phase1.start": "Phase 1 starten",
      "training.phase1.agentMessage": "Unsere Forschungsabteilung hat Schwächen ihrer Technologie entdeckt, die Ihnen helfen können. Lass uns mit den Techniken beginnen, die sich auf das Gesicht konzentrieren.",
      "training.phase2.title": "Phase 2",
      "training.phase2.subtitle": "Hintergrund & Texturen",
      "training.phase2.step1.title": "Wirbel",
      "training.phase2.step1.body": "Suche nach unnatürlichen oder verzerrten Formen, die auf künstliche Erstellung hinweisen könnten, besonders am Übergang zum Vordergrund.",
      "training.phase2.step2.title": "Texturen",
      "training.phase2.step2.body": "Wirken die Texturen von Stoff und anderen Materialien im Hintergrund echt oder wirken sie verzerrt oder verschwommen?",
      "training.phase2.step3.title": "Konsistenz bei Linien und Formen",
      "training.phase2.step3.body": "Sind Formen im Hintergrund konsistent? Gehen sie gerade von einer Seite auf die andere? Bleiben Winkel gleich?",
      "training.phase2.start": "Phase 2 starten",
      "training.phase2.agentMessage": "Gut gemacht. Auch im Hintergrund und an den Übergängen, finden sich Hinweise zur Unterscheidung.",
      "training.navigator1": "Lass uns einfach beginnen und auf Details im Gesicht achten...",
      "training.navigator2": "Jetzt etwas schwieriger:",
      "training.navigator3": "Schwerpunkt: Endgültige Gesamtbewertung",
      "training.hintButton": "Hinweis",
      "training.continue": "Weiter",
      "training.result.correct": "Richtig erkannt.",
      "training.result.incorrectPrefix": "Falsch. Die Person war:",
      "training.result.explanation": "Erklärung:",
      "training.hintPrefix": "Hinweis:",
      "training.complete.title": "Training abgeschlossen",
      "training.complete.correct": "Richtig",
      "training.complete.accuracy": "Genauigkeit",
      "training.complete.goQuiz": "Zur Quiz-Seite",
      "training.item1.explanation": "KI hat Schwierigkeiten, gleichmäßiges Licht und passende Reflexionen zu erzeugen, zum Beispiel in den Augen. Auch die Zähne sind uneinheitlich.",
      "training.item1.hint": "Konzentrieren Sie sich auf die Zähne und vergleichen Sie alle Augen.",
      "training.item2.explanation": "Reflexionen und Schatten sind stimmig. Die Form der Ohren ist symmetrisch und natürlich. Die Hautstruktur wirkt natürlich und detailreich.",
      "training.item2.hint": "Sind die Ohren symmetrisch? Gibt es passende Schatten und Reflexionen in den Augen? Wirkt die Haut natürlich?",
      "training.item3.explanation": "Unterschiedliche Beleuchtung in den Augen. Die Ohren sind asymmetrisch und die Haut ist verschwommen und ohne natürliche Details.",
      "training.item3.hint": "Sind Beleuchtung und Reflexionen stimmig? Sind Ohren und Gesicht symmetrisch? Gibt es klare natürliche Details in der Haut?",
      "training.item4.explanation": "Ein klarer Übergang zwischen feinen Haaren und dem Hintergrund. Linien im Hintergrund sind gerade und konsistent.",
      "training.item4.hint": "Sind die Linien im Hintergrund gerade und konsistent? Gibt es eine klare Trennung zwischen Vorder- und Hintergrund?",
      "training.item5.explanation": "Formen im Hintergrund sind verzogen und verschwommen. Es gibt keine konsistenten Linien oder andere Details. Außerdem werden unnatürliche Farben verwendet.",
      "training.item5.hint": "Macht der Hintergrund Sinn? Wirken die Formen natürlich?",
      "training.item6.explanation": "Dem Hintergrund fehlt Konsistenz. Der rechte Teil des Bildes ergibt keinen Sinn.",
      "training.item6.hint": "Wirkt der Hintergrund natürlich und stimmig?",
      "training.defaultMessage": "Analysieren Sie das Bild sorgfältig - Handelt es sich dabei um einen realen Menschen?",
      "training.finished.agentMessage": " Sie Haben die Trainingsphase erfolgreich abgeschlossen. Mit Ihren Instinkten und dem neu erworbenen Wissen können Sie nun die zweite Quizphase angehen. Viel Erfolg, Agent!",
    } 
  };
  const getLanguage = () => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return savedLanguage;
    }

    const browserLanguage = navigator.language?.slice(0, 2).toLowerCase();
    return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en";
  };

  const translateElement = (element, language) => {
    const key = element.dataset.i18n;
    if (!key) {
      return;
    }

    const value = translations[language]?.[key] ?? translations.en[key];
    if (typeof value === "undefined") {
      return;
    }

    if (element.dataset.i18nHtml === "true") {
      element.innerHTML = value;
      return;
    }

    element.textContent = value;
  };

  const translateDocument = (language) => {
    currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : "en";
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      translateElement(element, currentLanguage);
    });

    const languageSelect = document.getElementById("language-select");
    if (languageSelect && languageSelect.value !== currentLanguage) {
      languageSelect.value = currentLanguage;
    }
  };

  const setLanguage = (language) => {
    const normalizedLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : "en";
    localStorage.setItem(STORAGE_KEY, normalizedLanguage);
    translateDocument(normalizedLanguage);
  };

  const init = () => {
    const currentLanguage = getLanguage();
    translateDocument(currentLanguage);

    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
      languageSelect.addEventListener("change", (event) => {
        setLanguage(event.target.value);
      });
    }
  };

  const clickSoundState = {
    audioContext: null,
    enabled: true,
  };

  const getClickAudioContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }

    if (!clickSoundState.audioContext || clickSoundState.audioContext.state === "closed") {
      clickSoundState.audioContext = new AudioContextClass();
    }

    return clickSoundState.audioContext;
  };

  const playClickSound = () => {
    if (!clickSoundState.enabled) {
      return;
    }

    const audioContext = getClickAudioContext();
    if (!audioContext) {
      return;
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(360, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(280, audioContext.currentTime + 0.03);

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.048, audioContext.currentTime + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.055);
  };

  document.addEventListener(
    "click",
    (event) => {
      if (!event.isTrusted) {
        return;
      }

      const button = event.target.closest("button");
      if (!button || button.disabled || button.dataset.noClickSound === "true") {
        return;
      }

      playClickSound();
    },
    true
  );

  window.AIFakeGameI18n = {
    setLanguage,
    getLanguage,
    t: (key) => translations[currentLanguage]?.[key] ?? translations.en[key] ?? key,
    getCurrentLanguage: () => currentLanguage,
    translateDocument,
  };

  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();