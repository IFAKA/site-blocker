/**
 * Domain layer for Chinese Language Learning functionality
 * Pure business logic for Chinese vocabulary and exercises
 */

/**
 * Chinese vocabulary database
 * Each entry contains word, pinyin, meaning, and example sentence
 */
export const CHINESE_VOCABULARY = [
  {
    id: 1,
    word: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Hello',
    example: '你好，很高兴认识你。',
    examplePinyin: 'nǐ hǎo, hěn gāo xìng rèn shi nǐ.',
    exampleTranslation: 'Hello, nice to meet you.',
    difficulty: 'beginner'
  },
  {
    id: 2,
    word: '谢谢',
    pinyin: 'xiè xiè',
    meaning: 'Thank you',
    example: '谢谢你的帮助。',
    examplePinyin: 'xiè xiè nǐ de bāng zhù.',
    exampleTranslation: 'Thank you for your help.',
    difficulty: 'beginner'
  },
  {
    id: 3,
    word: '再见',
    pinyin: 'zài jiàn',
    meaning: 'Goodbye',
    example: '再见，明天见。',
    examplePinyin: 'zài jiàn, míng tiān jiàn.',
    exampleTranslation: 'Goodbye, see you tomorrow.',
    difficulty: 'beginner'
  },
  {
    id: 4,
    word: '学习',
    pinyin: 'xué xí',
    meaning: 'To study/learn',
    example: '我喜欢学习中文。',
    examplePinyin: 'wǒ xǐ huān xué xí zhōng wén.',
    exampleTranslation: 'I like studying Chinese.',
    difficulty: 'beginner'
  },
  {
    id: 5,
    word: '工作',
    pinyin: 'gōng zuò',
    meaning: 'Work/job',
    example: '我的工作很有趣。',
    examplePinyin: 'wǒ de gōng zuò hěn yǒu qù.',
    exampleTranslation: 'My work is very interesting.',
    difficulty: 'beginner'
  },
  {
    id: 6,
    word: '家庭',
    pinyin: 'jiā tíng',
    meaning: 'Family',
    example: '我有一个幸福的家庭。',
    examplePinyin: 'wǒ yǒu yī gè xìng fú de jiā tíng.',
    exampleTranslation: 'I have a happy family.',
    difficulty: 'intermediate'
  },
  {
    id: 7,
    word: '朋友',
    pinyin: 'péng yǒu',
    meaning: 'Friend',
    example: '他是我的好朋友。',
    examplePinyin: 'tā shì wǒ de hǎo péng yǒu.',
    exampleTranslation: 'He is my good friend.',
    difficulty: 'beginner'
  },
  {
    id: 8,
    word: '时间',
    pinyin: 'shí jiān',
    meaning: 'Time',
    example: '时间过得很快。',
    examplePinyin: 'shí jiān guò de hěn kuài.',
    exampleTranslation: 'Time passes quickly.',
    difficulty: 'intermediate'
  },
  {
    id: 9,
    word: '健康',
    pinyin: 'jiàn kāng',
    meaning: 'Health',
    example: '健康是最重要的。',
    examplePinyin: 'jiàn kāng shì zuì zhòng yào de.',
    exampleTranslation: 'Health is the most important.',
    difficulty: 'intermediate'
  },
  {
    id: 10,
    word: '成功',
    pinyin: 'chéng gōng',
    meaning: 'Success',
    example: '努力就会成功。',
    examplePinyin: 'nǔ lì jiù huì chéng gōng.',
    exampleTranslation: 'Hard work leads to success.',
    difficulty: 'intermediate'
  },
  {
    id: 11,
    word: '梦想',
    pinyin: 'mèng xiǎng',
    meaning: 'Dream',
    example: '我的梦想是环游世界。',
    examplePinyin: 'wǒ de mèng xiǎng shì huán yóu shì jiè.',
    exampleTranslation: 'My dream is to travel around the world.',
    difficulty: 'intermediate'
  },
  {
    id: 12,
    word: '机会',
    pinyin: 'jī huì',
    meaning: 'Opportunity',
    example: '这是一个好机会。',
    examplePinyin: 'zhè shì yī gè hǎo jī huì.',
    exampleTranslation: 'This is a good opportunity.',
    difficulty: 'intermediate'
  },
  {
    id: 13,
    word: '挑战',
    pinyin: 'tiǎo zhàn',
    meaning: 'Challenge',
    example: '我喜欢接受挑战。',
    examplePinyin: 'wǒ xǐ huān jiē shòu tiǎo zhàn.',
    exampleTranslation: 'I like accepting challenges.',
    difficulty: 'advanced'
  },
  {
    id: 14,
    word: '创新',
    pinyin: 'chuàng xīn',
    meaning: 'Innovation',
    example: '创新是发展的动力。',
    examplePinyin: 'chuàng xīn shì fā zhǎn de dòng lì.',
    exampleTranslation: 'Innovation is the driving force of development.',
    difficulty: 'advanced'
  },
  {
    id: 15,
    word: '智慧',
    pinyin: 'zhì huì',
    meaning: 'Wisdom',
    example: '智慧比知识更重要。',
    examplePinyin: 'zhì huì bǐ zhī shi gèng zhòng yào.',
    exampleTranslation: 'Wisdom is more important than knowledge.',
    difficulty: 'advanced'
  },
  // Basic Numbers
  {
    id: 16,
    word: '一',
    pinyin: 'yī',
    meaning: 'One',
    example: '我有一个苹果。',
    examplePinyin: 'wǒ yǒu yī gè píng guǒ.',
    exampleTranslation: 'I have one apple.',
    difficulty: 'beginner'
  },
  {
    id: 17,
    word: '二',
    pinyin: 'èr',
    meaning: 'Two',
    example: '我有两个朋友。',
    examplePinyin: 'wǒ yǒu liǎng gè péng yǒu.',
    exampleTranslation: 'I have two friends.',
    difficulty: 'beginner'
  },
  {
    id: 18,
    word: '三',
    pinyin: 'sān',
    meaning: 'Three',
    example: '三个人在房间里。',
    examplePinyin: 'sān gè rén zài fáng jiān lǐ.',
    exampleTranslation: 'Three people are in the room.',
    difficulty: 'beginner'
  },
  {
    id: 19,
    word: '四',
    pinyin: 'sì',
    meaning: 'Four',
    example: '一年有四季。',
    examplePinyin: 'yī nián yǒu sì jì.',
    exampleTranslation: 'A year has four seasons.',
    difficulty: 'beginner'
  },
  {
    id: 20,
    word: '五',
    pinyin: 'wǔ',
    meaning: 'Five',
    example: '我五岁了。',
    examplePinyin: 'wǒ wǔ suì le.',
    exampleTranslation: 'I am five years old.',
    difficulty: 'beginner'
  },
  {
    id: 21,
    word: '六',
    pinyin: 'liù',
    meaning: 'Six',
    example: '六点钟起床。',
    examplePinyin: 'liù diǎn zhōng qǐ chuáng.',
    exampleTranslation: 'Wake up at six o\'clock.',
    difficulty: 'beginner'
  },
  {
    id: 22,
    word: '七',
    pinyin: 'qī',
    meaning: 'Seven',
    example: '一个星期有七天。',
    examplePinyin: 'yī gè xīng qī yǒu qī tiān.',
    exampleTranslation: 'A week has seven days.',
    difficulty: 'beginner'
  },
  {
    id: 23,
    word: '八',
    pinyin: 'bā',
    meaning: 'Eight',
    example: '八月份很热。',
    examplePinyin: 'bā yuè fèn hěn rè.',
    exampleTranslation: 'August is very hot.',
    difficulty: 'beginner'
  },
  {
    id: 24,
    word: '九',
    pinyin: 'jiǔ',
    meaning: 'Nine',
    example: '九点钟睡觉。',
    examplePinyin: 'jiǔ diǎn zhōng shuì jiào.',
    exampleTranslation: 'Go to sleep at nine o\'clock.',
    difficulty: 'beginner'
  },
  {
    id: 25,
    word: '十',
    pinyin: 'shí',
    meaning: 'Ten',
    example: '我有十个朋友。',
    examplePinyin: 'wǒ yǒu shí gè péng yǒu.',
    exampleTranslation: 'I have ten friends.',
    difficulty: 'beginner'
  },
  // Family Members
  {
    id: 26,
    word: '爸爸',
    pinyin: 'bà ba',
    meaning: 'Father/Dad',
    example: '我爸爸是医生。',
    examplePinyin: 'wǒ bà ba shì yī shēng.',
    exampleTranslation: 'My father is a doctor.',
    difficulty: 'beginner'
  },
  {
    id: 27,
    word: '妈妈',
    pinyin: 'mā ma',
    meaning: 'Mother/Mom',
    example: '我妈妈很漂亮。',
    examplePinyin: 'wǒ mā ma hěn piào liang.',
    exampleTranslation: 'My mother is very beautiful.',
    difficulty: 'beginner'
  },
  {
    id: 28,
    word: '哥哥',
    pinyin: 'gē ge',
    meaning: 'Older brother',
    example: '我哥哥比我大。',
    examplePinyin: 'wǒ gē ge bǐ wǒ dà.',
    exampleTranslation: 'My older brother is older than me.',
    difficulty: 'beginner'
  },
  {
    id: 29,
    word: '姐姐',
    pinyin: 'jiě jie',
    meaning: 'Older sister',
    example: '我姐姐很聪明。',
    examplePinyin: 'wǒ jiě jie hěn cōng míng.',
    exampleTranslation: 'My older sister is very smart.',
    difficulty: 'beginner'
  },
  {
    id: 30,
    word: '弟弟',
    pinyin: 'dì di',
    meaning: 'Younger brother',
    example: '我弟弟很可爱。',
    examplePinyin: 'wǒ dì di hěn kě ài.',
    exampleTranslation: 'My younger brother is very cute.',
    difficulty: 'beginner'
  },
  {
    id: 31,
    word: '妹妹',
    pinyin: 'mèi mei',
    meaning: 'Younger sister',
    example: '我妹妹很可爱。',
    examplePinyin: 'wǒ mèi mei hěn kě ài.',
    exampleTranslation: 'My younger sister is very cute.',
    difficulty: 'beginner'
  },
  {
    id: 32,
    word: '爷爷',
    pinyin: 'yé ye',
    meaning: 'Grandfather',
    example: '我爷爷很健康。',
    examplePinyin: 'wǒ yé ye hěn jiàn kāng.',
    exampleTranslation: 'My grandfather is very healthy.',
    difficulty: 'beginner'
  },
  {
    id: 33,
    word: '奶奶',
    pinyin: 'nǎi nai',
    meaning: 'Grandmother',
    example: '我奶奶很慈祥。',
    examplePinyin: 'wǒ nǎi nai hěn cí xiáng.',
    exampleTranslation: 'My grandmother is very kind.',
    difficulty: 'beginner'
  },
  // Colors
  {
    id: 34,
    word: '红色',
    pinyin: 'hóng sè',
    meaning: 'Red',
    example: '我喜欢红色的花。',
    examplePinyin: 'wǒ xǐ huān hóng sè de huā.',
    exampleTranslation: 'I like red flowers.',
    difficulty: 'beginner'
  },
  {
    id: 35,
    word: '蓝色',
    pinyin: 'lán sè',
    meaning: 'Blue',
    example: '天空是蓝色的。',
    examplePinyin: 'tiān kōng shì lán sè de.',
    exampleTranslation: 'The sky is blue.',
    difficulty: 'beginner'
  },
  {
    id: 36,
    word: '绿色',
    pinyin: 'lǜ sè',
    meaning: 'Green',
    example: '草是绿色的。',
    examplePinyin: 'cǎo shì lǜ sè de.',
    exampleTranslation: 'Grass is green.',
    difficulty: 'beginner'
  },
  {
    id: 37,
    word: '黄色',
    pinyin: 'huáng sè',
    meaning: 'Yellow',
    example: '太阳是黄色的。',
    examplePinyin: 'tài yáng shì huáng sè de.',
    exampleTranslation: 'The sun is yellow.',
    difficulty: 'beginner'
  },
  {
    id: 38,
    word: '白色',
    pinyin: 'bái sè',
    meaning: 'White',
    example: '雪是白色的。',
    examplePinyin: 'xuě shì bái sè de.',
    exampleTranslation: 'Snow is white.',
    difficulty: 'beginner'
  },
  {
    id: 39,
    word: '黑色',
    pinyin: 'hēi sè',
    meaning: 'Black',
    example: '夜晚是黑色的。',
    examplePinyin: 'yè wǎn shì hēi sè de.',
    exampleTranslation: 'Night is black.',
    difficulty: 'beginner'
  },
  // Food
  {
    id: 40,
    word: '米饭',
    pinyin: 'mǐ fàn',
    meaning: 'Rice',
    example: '我每天吃米饭。',
    examplePinyin: 'wǒ měi tiān chī mǐ fàn.',
    exampleTranslation: 'I eat rice every day.',
    difficulty: 'beginner'
  },
  {
    id: 41,
    word: '面条',
    pinyin: 'miàn tiáo',
    meaning: 'Noodles',
    example: '我喜欢吃面条。',
    examplePinyin: 'wǒ xǐ huān chī miàn tiáo.',
    exampleTranslation: 'I like to eat noodles.',
    difficulty: 'beginner'
  },
  {
    id: 42,
    word: '苹果',
    pinyin: 'píng guǒ',
    meaning: 'Apple',
    example: '这个苹果很甜。',
    examplePinyin: 'zhè gè píng guǒ hěn tián.',
    exampleTranslation: 'This apple is very sweet.',
    difficulty: 'beginner'
  },
  {
    id: 43,
    word: '香蕉',
    pinyin: 'xiāng jiāo',
    meaning: 'Banana',
    example: '香蕉是黄色的。',
    examplePinyin: 'xiāng jiāo shì huáng sè de.',
    exampleTranslation: 'Bananas are yellow.',
    difficulty: 'beginner'
  },
  {
    id: 44,
    word: '水',
    pinyin: 'shuǐ',
    meaning: 'Water',
    example: '我需要喝水。',
    examplePinyin: 'wǒ xū yào hē shuǐ.',
    exampleTranslation: 'I need to drink water.',
    difficulty: 'beginner'
  },
  {
    id: 45,
    word: '茶',
    pinyin: 'chá',
    meaning: 'Tea',
    example: '我喜欢喝茶。',
    examplePinyin: 'wǒ xǐ huān hē chá.',
    exampleTranslation: 'I like to drink tea.',
    difficulty: 'beginner'
  },
  {
    id: 46,
    word: '咖啡',
    pinyin: 'kā fēi',
    meaning: 'Coffee',
    example: '我每天早上喝咖啡。',
    examplePinyin: 'wǒ měi tiān zǎo shàng hē kā fēi.',
    exampleTranslation: 'I drink coffee every morning.',
    difficulty: 'beginner'
  },
  // Animals
  {
    id: 47,
    word: '猫',
    pinyin: 'māo',
    meaning: 'Cat',
    example: '我有一只猫。',
    examplePinyin: 'wǒ yǒu yī zhī māo.',
    exampleTranslation: 'I have a cat.',
    difficulty: 'beginner'
  },
  {
    id: 48,
    word: '狗',
    pinyin: 'gǒu',
    meaning: 'Dog',
    example: '狗是人类的朋友。',
    examplePinyin: 'gǒu shì rén lèi de péng yǒu.',
    exampleTranslation: 'Dogs are friends of humans.',
    difficulty: 'beginner'
  },
  {
    id: 49,
    word: '鸟',
    pinyin: 'niǎo',
    meaning: 'Bird',
    example: '鸟在天空中飞翔。',
    examplePinyin: 'niǎo zài tiān kōng zhōng fēi xiáng.',
    exampleTranslation: 'Birds fly in the sky.',
    difficulty: 'beginner'
  },
  {
    id: 50,
    word: '鱼',
    pinyin: 'yú',
    meaning: 'Fish',
    example: '鱼生活在水中。',
    examplePinyin: 'yú shēng huó zài shuǐ zhōng.',
    exampleTranslation: 'Fish live in water.',
    difficulty: 'beginner'
  },
  {
    id: 51,
    word: '马',
    pinyin: 'mǎ',
    meaning: 'Horse',
    example: '马跑得很快。',
    examplePinyin: 'mǎ pǎo de hěn kuài.',
    exampleTranslation: 'Horses run very fast.',
    difficulty: 'beginner'
  },
  {
    id: 52,
    word: '牛',
    pinyin: 'niú',
    meaning: 'Cow',
    example: '牛在草地上吃草。',
    examplePinyin: 'niú zài cǎo dì shàng chī cǎo.',
    exampleTranslation: 'Cows eat grass in the meadow.',
    difficulty: 'beginner'
  },
  {
    id: 53,
    word: '猪',
    pinyin: 'zhū',
    meaning: 'Pig',
    example: '猪很聪明。',
    examplePinyin: 'zhū hěn cōng míng.',
    exampleTranslation: 'Pigs are very smart.',
    difficulty: 'beginner'
  },
  {
    id: 54,
    word: '鸡',
    pinyin: 'jī',
    meaning: 'Chicken',
    example: '鸡会下蛋。',
    examplePinyin: 'jī huì xià dàn.',
    exampleTranslation: 'Chickens lay eggs.',
    difficulty: 'beginner'
  },
  // Body Parts
  {
    id: 55,
    word: '头',
    pinyin: 'tóu',
    meaning: 'Head',
    example: '我的头很疼。',
    examplePinyin: 'wǒ de tóu hěn téng.',
    exampleTranslation: 'My head hurts.',
    difficulty: 'beginner'
  },
  {
    id: 56,
    word: '眼睛',
    pinyin: 'yǎn jing',
    meaning: 'Eyes',
    example: '我的眼睛很大。',
    examplePinyin: 'wǒ de yǎn jing hěn dà.',
    exampleTranslation: 'My eyes are very big.',
    difficulty: 'beginner'
  },
  {
    id: 57,
    word: '鼻子',
    pinyin: 'bí zi',
    meaning: 'Nose',
    example: '我的鼻子很直。',
    examplePinyin: 'wǒ de bí zi hěn zhí.',
    exampleTranslation: 'My nose is very straight.',
    difficulty: 'beginner'
  },
  {
    id: 58,
    word: '嘴巴',
    pinyin: 'zuǐ ba',
    meaning: 'Mouth',
    example: '请张开嘴巴。',
    examplePinyin: 'qǐng zhāng kāi zuǐ ba.',
    exampleTranslation: 'Please open your mouth.',
    difficulty: 'beginner'
  },
  {
    id: 59,
    word: '手',
    pinyin: 'shǒu',
    meaning: 'Hand',
    example: '请举起你的手。',
    examplePinyin: 'qǐng jǔ qǐ nǐ de shǒu.',
    exampleTranslation: 'Please raise your hand.',
    difficulty: 'beginner'
  },
  {
    id: 60,
    word: '脚',
    pinyin: 'jiǎo',
    meaning: 'Foot',
    example: '我的脚很累。',
    examplePinyin: 'wǒ de jiǎo hěn lèi.',
    exampleTranslation: 'My feet are very tired.',
    difficulty: 'beginner'
  },
  {
    id: 61,
    word: '耳朵',
    pinyin: 'ěr duo',
    meaning: 'Ear',
    example: '我的耳朵很灵敏。',
    examplePinyin: 'wǒ de ěr duo hěn líng mǐn.',
    exampleTranslation: 'My ears are very sensitive.',
    difficulty: 'beginner'
  },
  // Common Verbs
  {
    id: 62,
    word: '吃',
    pinyin: 'chī',
    meaning: 'To eat',
    example: '我喜欢吃中国菜。',
    examplePinyin: 'wǒ xǐ huān chī zhōng guó cài.',
    exampleTranslation: 'I like to eat Chinese food.',
    difficulty: 'beginner'
  },
  {
    id: 63,
    word: '喝',
    pinyin: 'hē',
    meaning: 'To drink',
    example: '我想喝水。',
    examplePinyin: 'wǒ xiǎng hē shuǐ.',
    exampleTranslation: 'I want to drink water.',
    difficulty: 'beginner'
  },
  {
    id: 64,
    word: '睡',
    pinyin: 'shuì',
    meaning: 'To sleep',
    example: '我每天晚上十点睡觉。',
    examplePinyin: 'wǒ měi tiān wǎn shàng shí diǎn shuì jiào.',
    exampleTranslation: 'I go to sleep at 10 PM every night.',
    difficulty: 'beginner'
  },
  {
    id: 65,
    word: '走',
    pinyin: 'zǒu',
    meaning: 'To walk',
    example: '我走路去学校。',
    examplePinyin: 'wǒ zǒu lù qù xué xiào.',
    exampleTranslation: 'I walk to school.',
    difficulty: 'beginner'
  },
  {
    id: 66,
    word: '跑',
    pinyin: 'pǎo',
    meaning: 'To run',
    example: '我每天早上跑步。',
    examplePinyin: 'wǒ měi tiān zǎo shàng pǎo bù.',
    exampleTranslation: 'I run every morning.',
    difficulty: 'beginner'
  },
  {
    id: 67,
    word: '看',
    pinyin: 'kàn',
    meaning: 'To look/see',
    example: '我喜欢看电影。',
    examplePinyin: 'wǒ xǐ huān kàn diàn yǐng.',
    exampleTranslation: 'I like to watch movies.',
    difficulty: 'beginner'
  },
  {
    id: 68,
    word: '听',
    pinyin: 'tīng',
    meaning: 'To listen/hear',
    example: '我喜欢听音乐。',
    examplePinyin: 'wǒ xǐ huān tīng yīn yuè.',
    exampleTranslation: 'I like to listen to music.',
    difficulty: 'beginner'
  },
  {
    id: 69,
    word: '说',
    pinyin: 'shuō',
    meaning: 'To speak/say',
    example: '我会说中文。',
    examplePinyin: 'wǒ huì shuō zhōng wén.',
    exampleTranslation: 'I can speak Chinese.',
    difficulty: 'beginner'
  },
  {
    id: 70,
    word: '读',
    pinyin: 'dú',
    meaning: 'To read',
    example: '我喜欢读书。',
    examplePinyin: 'wǒ xǐ huān dú shū.',
    exampleTranslation: 'I like to read books.',
    difficulty: 'beginner'
  },
  {
    id: 71,
    word: '写',
    pinyin: 'xiě',
    meaning: 'To write',
    example: '我会写汉字。',
    examplePinyin: 'wǒ huì xiě hàn zì.',
    exampleTranslation: 'I can write Chinese characters.',
    difficulty: 'beginner'
  },
  {
    id: 72,
    word: '买',
    pinyin: 'mǎi',
    meaning: 'To buy',
    example: '我想买一本书。',
    examplePinyin: 'wǒ xiǎng mǎi yī běn shū.',
    exampleTranslation: 'I want to buy a book.',
    difficulty: 'beginner'
  },
  {
    id: 73,
    word: '卖',
    pinyin: 'mài',
    meaning: 'To sell',
    example: '我想卖我的车。',
    examplePinyin: 'wǒ xiǎng mài wǒ de chē.',
    exampleTranslation: 'I want to sell my car.',
    difficulty: 'beginner'
  },
  {
    id: 74,
    word: '给',
    pinyin: 'gěi',
    meaning: 'To give',
    example: '请给我一杯水。',
    examplePinyin: 'qǐng gěi wǒ yī bēi shuǐ.',
    exampleTranslation: 'Please give me a glass of water.',
    difficulty: 'beginner'
  },
  {
    id: 75,
    word: '拿',
    pinyin: 'ná',
    meaning: 'To take/hold',
    example: '请拿这个包。',
    examplePinyin: 'qǐng ná zhè gè bāo.',
    exampleTranslation: 'Please take this bag.',
    difficulty: 'beginner'
  },
  {
    id: 76,
    word: '放',
    pinyin: 'fàng',
    meaning: 'To put/place',
    example: '请把书放在桌子上。',
    examplePinyin: 'qǐng bǎ shū fàng zài zhuō zi shàng.',
    exampleTranslation: 'Please put the book on the table.',
    difficulty: 'beginner'
  },
  {
    id: 77,
    word: '坐',
    pinyin: 'zuò',
    meaning: 'To sit',
    example: '请坐在这里。',
    examplePinyin: 'qǐng zuò zài zhè lǐ.',
    exampleTranslation: 'Please sit here.',
    difficulty: 'beginner'
  },
  {
    id: 78,
    word: '站',
    pinyin: 'zhàn',
    meaning: 'To stand',
    example: '请站起来。',
    examplePinyin: 'qǐng zhàn qǐ lái.',
    exampleTranslation: 'Please stand up.',
    difficulty: 'beginner'
  },
  {
    id: 79,
    word: '开',
    pinyin: 'kāi',
    meaning: 'To open',
    example: '请开门。',
    examplePinyin: 'qǐng kāi mén.',
    exampleTranslation: 'Please open the door.',
    difficulty: 'beginner'
  },
  {
    id: 80,
    word: '关',
    pinyin: 'guān',
    meaning: 'To close',
    example: '请关门。',
    examplePinyin: 'qǐng guān mén.',
    exampleTranslation: 'Please close the door.',
    difficulty: 'beginner'
  },
  {
    id: 81,
    word: '来',
    pinyin: 'lái',
    meaning: 'To come',
    example: '请来这里。',
    examplePinyin: 'qǐng lái zhè lǐ.',
    exampleTranslation: 'Please come here.',
    difficulty: 'beginner'
  },
  {
    id: 82,
    word: '去',
    pinyin: 'qù',
    meaning: 'To go',
    example: '我想去中国。',
    examplePinyin: 'wǒ xiǎng qù zhōng guó.',
    exampleTranslation: 'I want to go to China.',
    difficulty: 'beginner'
  },
  {
    id: 83,
    word: '回',
    pinyin: 'huí',
    meaning: 'To return',
    example: '我想回家。',
    examplePinyin: 'wǒ xiǎng huí jiā.',
    exampleTranslation: 'I want to go home.',
    difficulty: 'beginner'
  },
  {
    id: 84,
    word: '到',
    pinyin: 'dào',
    meaning: 'To arrive',
    example: '我到了学校。',
    examplePinyin: 'wǒ dào le xué xiào.',
    exampleTranslation: 'I arrived at school.',
    difficulty: 'beginner'
  },
  {
    id: 85,
    word: '在',
    pinyin: 'zài',
    meaning: 'To be at/in',
    example: '我在家里。',
    examplePinyin: 'wǒ zài jiā lǐ.',
    exampleTranslation: 'I am at home.',
    difficulty: 'beginner'
  },
  {
    id: 86,
    word: '有',
    pinyin: 'yǒu',
    meaning: 'To have',
    example: '我有一本书。',
    examplePinyin: 'wǒ yǒu yī běn shū.',
    exampleTranslation: 'I have a book.',
    difficulty: 'beginner'
  },
  {
    id: 87,
    word: '是',
    pinyin: 'shì',
    meaning: 'To be',
    example: '我是学生。',
    examplePinyin: 'wǒ shì xué shēng.',
    exampleTranslation: 'I am a student.',
    difficulty: 'beginner'
  },
  {
    id: 88,
    word: '做',
    pinyin: 'zuò',
    meaning: 'To do/make',
    example: '我在做作业。',
    examplePinyin: 'wǒ zài zuò zuò yè.',
    exampleTranslation: 'I am doing homework.',
    difficulty: 'beginner'
  },
  {
    id: 89,
    word: '工作',
    pinyin: 'gōng zuò',
    meaning: 'To work',
    example: '我在银行工作。',
    examplePinyin: 'wǒ zài yín háng gōng zuò.',
    exampleTranslation: 'I work at a bank.',
    difficulty: 'beginner'
  },
  {
    id: 90,
    word: '学习',
    pinyin: 'xué xí',
    meaning: 'To study',
    example: '我喜欢学习中文。',
    examplePinyin: 'wǒ xǐ huān xué xí zhōng wén.',
    exampleTranslation: 'I like to study Chinese.',
    difficulty: 'beginner'
  },
  {
    id: 91,
    word: '教',
    pinyin: 'jiāo',
    meaning: 'To teach',
    example: '我教中文。',
    examplePinyin: 'wǒ jiāo zhōng wén.',
    exampleTranslation: 'I teach Chinese.',
    difficulty: 'beginner'
  },
  {
    id: 92,
    word: '帮助',
    pinyin: 'bāng zhù',
    meaning: 'To help',
    example: '请帮助我。',
    examplePinyin: 'qǐng bāng zhù wǒ.',
    exampleTranslation: 'Please help me.',
    difficulty: 'beginner'
  },
  {
    id: 93,
    word: '知道',
    pinyin: 'zhī dào',
    meaning: 'To know',
    example: '我知道答案。',
    examplePinyin: 'wǒ zhī dào dá àn.',
    exampleTranslation: 'I know the answer.',
    difficulty: 'beginner'
  },
  {
    id: 94,
    word: '想',
    pinyin: 'xiǎng',
    meaning: 'To want/think',
    example: '我想去中国。',
    examplePinyin: 'wǒ xiǎng qù zhōng guó.',
    exampleTranslation: 'I want to go to China.',
    difficulty: 'beginner'
  },
  {
    id: 95,
    word: '喜欢',
    pinyin: 'xǐ huān',
    meaning: 'To like',
    example: '我喜欢音乐。',
    examplePinyin: 'wǒ xǐ huān yīn yuè.',
    exampleTranslation: 'I like music.',
    difficulty: 'beginner'
  },
  {
    id: 96,
    word: '爱',
    pinyin: 'ài',
    meaning: 'To love',
    example: '我爱我的家人。',
    examplePinyin: 'wǒ ài wǒ de jiā rén.',
    exampleTranslation: 'I love my family.',
    difficulty: 'beginner'
  },
  {
    id: 97,
    word: '需要',
    pinyin: 'xū yào',
    meaning: 'To need',
    example: '我需要帮助。',
    examplePinyin: 'wǒ xū yào bāng zhù.',
    exampleTranslation: 'I need help.',
    difficulty: 'beginner'
  },
  {
    id: 98,
    word: '可以',
    pinyin: 'kě yǐ',
    meaning: 'Can/may',
    example: '我可以进来吗？',
    examplePinyin: 'wǒ kě yǐ jìn lái ma?',
    exampleTranslation: 'May I come in?',
    difficulty: 'beginner'
  },
  {
    id: 99,
    word: '应该',
    pinyin: 'yīng gāi',
    meaning: 'Should',
    example: '我应该学习。',
    examplePinyin: 'wǒ yīng gāi xué xí.',
    exampleTranslation: 'I should study.',
    difficulty: 'beginner'
  },
  {
    id: 100,
    word: '会',
    pinyin: 'huì',
    meaning: 'Can/know how to',
    example: '我会游泳。',
    examplePinyin: 'wǒ huì yóu yǒng.',
    exampleTranslation: 'I can swim.',
    difficulty: 'beginner'
  }
];

/**
 * Get random vocabulary entry
 * @param {string} difficulty - Difficulty level (beginner, intermediate, advanced)
 * @returns {Object} Random vocabulary entry
 */
export function getRandomVocabulary(difficulty = null) {
  let vocabulary = CHINESE_VOCABULARY;
  
  if (difficulty) {
    vocabulary = CHINESE_VOCABULARY.filter(item => item.difficulty === difficulty);
  }
  
  if (vocabulary.length === 0) {
    return CHINESE_VOCABULARY[0]; // Fallback to first entry
  }
  
  const randomIndex = Math.floor(Math.random() * vocabulary.length);
  return vocabulary[randomIndex];
}

/**
 * Get vocabulary by difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {Array} Array of vocabulary entries
 */
export function getVocabularyByDifficulty(difficulty) {
  return CHINESE_VOCABULARY.filter(item => item.difficulty === difficulty);
}

/**
 * Get all difficulty levels
 * @returns {Array} Array of difficulty levels
 */
export function getDifficultyLevels() {
  return ['beginner', 'intermediate', 'advanced'];
}

/**
 * Get vocabulary statistics
 * @returns {Object} Statistics about vocabulary
 */
export function getVocabularyStatistics() {
  const total = CHINESE_VOCABULARY.length;
  const beginner = CHINESE_VOCABULARY.filter(item => item.difficulty === 'beginner').length;
  const intermediate = CHINESE_VOCABULARY.filter(item => item.difficulty === 'intermediate').length;
  const advanced = CHINESE_VOCABULARY.filter(item => item.difficulty === 'advanced').length;
  
  return {
    total,
    beginner,
    intermediate,
    advanced
  };
}

/**
 * Search vocabulary by word or meaning
 * @param {string} query - Search query
 * @returns {Array} Array of matching vocabulary entries
 */
export function searchVocabulary(query) {
  if (!query || query.trim() === '') {
    return CHINESE_VOCABULARY;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return CHINESE_VOCABULARY.filter(item => 
    item.word.toLowerCase().includes(searchTerm) ||
    item.pinyin.toLowerCase().includes(searchTerm) ||
    item.meaning.toLowerCase().includes(searchTerm) ||
    item.example.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get vocabulary by ID
 * @param {number} id - Vocabulary ID
 * @returns {Object|null} Vocabulary entry or null
 */
export function getVocabularyById(id) {
  return CHINESE_VOCABULARY.find(item => item.id === id) || null;
}

/**
 * Validate vocabulary entry
 * @param {Object} entry - Vocabulary entry to validate
 * @returns {Object} Validation result
 */
export function validateVocabularyEntry(entry) {
  const errors = [];
  
  if (!entry.word || entry.word.trim() === '') {
    errors.push('Word is required');
  }
  
  if (!entry.pinyin || entry.pinyin.trim() === '') {
    errors.push('Pinyin is required');
  }
  
  if (!entry.meaning || entry.meaning.trim() === '') {
    errors.push('Meaning is required');
  }
  
  if (!entry.example || entry.example.trim() === '') {
    errors.push('Example sentence is required');
  }
  
  if (!entry.difficulty || !['beginner', 'intermediate', 'advanced'].includes(entry.difficulty)) {
    errors.push('Valid difficulty level is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get learning progress for a vocabulary entry
 * @param {number} vocabularyId - Vocabulary ID
 * @param {Object} progressData - Progress data from storage
 * @returns {Object} Progress information
 */
export function getVocabularyProgress(vocabularyId, progressData = {}) {
  const entry = getVocabularyById(vocabularyId);
  if (!entry) {
    return { attempts: 0, correct: 0, lastStudied: null, mastery: 0 };
  }
  
  const progress = progressData[vocabularyId] || { attempts: 0, correct: 0, lastStudied: null };
  const mastery = progress.attempts > 0 ? Math.round((progress.correct / progress.attempts) * 100) : 0;
  
  return {
    attempts: progress.attempts || 0,
    correct: progress.correct || 0,
    lastStudied: progress.lastStudied || null,
    mastery
  };
}

/**
 * Update learning progress for a vocabulary entry
 * @param {number} vocabularyId - Vocabulary ID
 * @param {boolean} isCorrect - Whether the answer was correct
 * @param {Object} progressData - Current progress data
 * @returns {Object} Updated progress data
 */
export function updateVocabularyProgress(vocabularyId, isCorrect, progressData = {}) {
  const currentProgress = progressData[vocabularyId] || { attempts: 0, correct: 0, lastStudied: null };
  
  return {
    ...progressData,
    [vocabularyId]: {
      attempts: currentProgress.attempts + 1,
      correct: currentProgress.correct + (isCorrect ? 1 : 0),
      lastStudied: new Date().toISOString()
    }
  };
}

/**
 * Get overall learning statistics
 * @param {Object} progressData - Progress data from storage
 * @returns {Object} Overall statistics
 */
export function getOverallLearningStatistics(progressData = {}) {
  const entries = Object.values(progressData);
  const totalAttempts = entries.reduce((sum, entry) => sum + (entry.attempts || 0), 0);
  const totalCorrect = entries.reduce((sum, entry) => sum + (entry.correct || 0), 0);
  const totalWords = entries.length;
  const averageMastery = totalWords > 0 ? 
    entries.reduce((sum, entry) => {
      const mastery = entry.attempts > 0 ? (entry.correct / entry.attempts) * 100 : 0;
      return sum + mastery;
    }, 0) / totalWords : 0;
  
  return {
    totalWords,
    totalAttempts,
    totalCorrect,
    averageMastery: Math.round(averageMastery),
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  };
}

/**
 * Get next vocabulary entry in sequence
 * @param {number} currentId - Current vocabulary ID
 * @returns {Object} Next vocabulary entry
 */
export function getNextVocabulary(currentId) {
  const currentIndex = CHINESE_VOCABULARY.findIndex(v => v.id === currentId);
  if (currentIndex === -1) return null;
  
  const nextIndex = (currentIndex + 1) % CHINESE_VOCABULARY.length;
  return CHINESE_VOCABULARY[nextIndex];
}

/**
 * Get previous vocabulary entry in sequence
 * @param {number} currentId - Current vocabulary ID
 * @returns {Object} Previous vocabulary entry
 */
export function getPrevVocabulary(currentId) {
  const currentIndex = CHINESE_VOCABULARY.findIndex(v => v.id === currentId);
  if (currentIndex === -1) return null;
  
  const prevIndex = currentIndex === 0 ? CHINESE_VOCABULARY.length - 1 : currentIndex - 1;
  return CHINESE_VOCABULARY[prevIndex];
}
