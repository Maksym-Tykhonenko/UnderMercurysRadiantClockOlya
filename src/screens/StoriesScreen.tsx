import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Stories'>;

const stories = [
  {
    id: '1',
    title: '🌞 The Clock That Faced the Sun',
    excerpt: 'In the ancient temple city of Heliopolis, long before mechanical ...',
    content: `In the ancient temple city of Heliopolis, long before mechanical clocks ever ticked, a massive obelisk was erected to mark time by the fall of sunlight. The people believed the Sun itself was a god whose rays carried secrets — memories of days past and glimpses of what might come. When the shadow of the obelisk reached a specific stone, it was time to offer incense and record the moment in stone and song.
Centuries later, historians found that this ritual marked not just hours, but emotions. The positioning of the light was used to remember births, victories, losses, and celestial alignments. It wasn’t just a calendar. It was a diary of light.
When you count your days — forward or back — you're doing something humans have done for millennia. But in our modern world, we have forgotten the poetry of it. We’ve turned clocks into blunt tools. Yet still, the Sun rises, the shadows stretch, and deep within us remains the urge to mark meaning into time.
So let your digital moment shine like a shadow across an ancient stone. Give your memories light. You are not just counting. You are remembering in the language of the sky.`,
  },
  {
    id: '2',
    title: '🪐 The Days Mercury Disappeared',
    excerpt: 'Mercury, the swift messenger of the gods and the fastest planet ...',
    content: `Mercury, the swift messenger of the gods and the fastest planet around our star, is notorious for vanishing. Three or four times a year, it slips into the Sun’s glare — too close for telescopes, too bright for eyes. It becomes invisible. Ancient astronomers feared these disappearances. Some believed Mercury dipped into the underworld to deliver news to the dead.
But here’s the truth: when Mercury disappears, it begins something new. It resets its orbit, it passes between us and the Sun, and it emerges on the other side — brighter, reborn. It is still moving, still counting, still radiant in its silence.
We all have Mercury moments. Times when we fall out of sight. When we feel too close to some burning truth, overwhelmed, unable to be seen. But just like the planet, we do not stop. We orbit, we pass through the glare, and we return.
This app doesn’t just show days and numbers. It honors the spaces in between. The unseen days, the quiet stretches. Because every countdown, every count-from, holds more than we show. It holds what we pass through when we seem to vanish.`,
  },
  {
    id: '3',
    title: '🌠 The Light That Keeps Secrets',
    excerpt: 'There’s a light in the sky that pulses so faintly most eyes ...',
    content: `There’s a light in the sky that pulses so faintly most eyes never see it. Astronomers call it a variable star — its brightness changes slowly over weeks, months, even years. Some cultures believed these stars were keepers of forgotten stories, whispering truths at intervals only the cosmos understood.
One such star sits near Mercury’s orbital path, flickering softly in the background like a heartbeat behind a melody. It's easy to ignore. It doesn’t dazzle. But it's always there — changing, tracking, remembering.
And maybe that’s how memories really work. They aren’t always bright. Some are quiet pulses, returning gently when you least expect them. A song on the radio, a smell of something half-remembered, a date that sneaks up on you in the calendar and reminds you of something you thought you had let go.
This is why you mark your moments. This is why you count. Not to remember everything, but to build patterns in time, so when the memory pulses back into view — faint but familiar — you’ll recognize it. You’ll know: this star was always part of your sky.`,
  },
  {
    id: '4',
    title: '🔭 When Time Broke on the Moon',
    excerpt: 'There was a moment during the Apollo 11 mission when the clocks ...',
    content: `There was a moment during the Apollo 11 mission when the clocks on Earth and the experience of time on the Moon quietly diverged. Not by much — mere seconds, perhaps — but the astronauts reported that time felt off. Minutes stretched or collapsed, depending on whether they were working in shadow or exposed to the unfiltered light of the Sun.
Time on the Moon is strange. A day there lasts 29 Earth days. Shadows don’t soften — they slice the surface like cuts of black glass. And though Earth turns and time passes for billions, a single footprint remains pressed into dust where nothing has moved for decades.
This is the beauty of marking moments: you are building footprints in your own time-lunar surface. When things around you feel fast, or when days feel frozen, your moments remain. Even if time breaks — even if the world changes its rhythm — you’ll have your own record, your own gravity.
To live fully is not to control time, but to plant flags in it. To say: I was here. I felt this. I will remember it, even if the clocks forget.`,
  },
  {
    id: '5',
    title: '🌞 The Child Who Chased Sunrises',
    excerpt: 'There’s an old story told by desert dwellers of a child ...',
    content: `There’s an old story told by desert dwellers of a child who could not sleep at night because she was always chasing the next sunrise. Each evening, as the sky turned violet and cooled, she would climb the highest hill and wait. Not for stars, but for the light to return. She wasn’t afraid of the dark — she was simply in love with beginnings.
They say that one night, she whispered to the stars, Show me a place where morning never ends. And the stars answered: That place is not a location. It’s a way of remembering.
You see, some people mark their days by what ends — the goodbyes, the endings, the farewells. But others, like that child, count by what begins. New friendships. The first day in a new city. The first step after healing. These are also moments to record.
You can chase sunrises too — in your own way. Not with footsteps up a hill, but by saving your beginnings. And as the child grew, her memory of mornings turned into stories, and her stories turned into stars.
And those stars? They shine still, each one a moment she never let go of.`,
  },
  {
    id: '6',
    title: '🌌 The Memory Inside the Meteor',
    excerpt: 'Some years ago, a meteor entered Earth’s atmosphere over Siberia ...',
    content: `Some years ago, a meteor entered Earth’s atmosphere over the skies of Siberia. It was unannounced, unwelcome, and unforgettable. It split the air with sound before it burned away, leaving nothing but shattered glass and frightened eyes behind.
But here’s what most people don’t know: inside that meteor, scientists found fragments older than the solar system itself. Tiny stardust particles that predate Earth. Matter that once floated in the galactic dark before even Mercury was born.
Time isn’t always forward. Sometimes it falls down to us from the past — in sparks, in dreams, in stories, in signs.
And sometimes, in your own life, something unexpected crashes through your sky. A message. A person. A day that changes everything. It might seem like a disruption, but deep inside it may carry something ancient and necessary — something you were meant to hold.
This app is your meteor journal. Not everything will be planned. Not every moment will be gentle. But all of them are pieces of the sky.`,
  },
];

const StoriesScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ImageBackground
      source={require('../assets/background_home.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back_icon.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.header}>
          <Text style={styles.headerGradient}>Stories from the Orbit</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('StoryDetail', {
                title: story.title,
                content: story.content,
              })
            }
          >
            <Text style={styles.cardTitle}>{story.title}</Text>
            <Text style={styles.cardExcerpt}>{story.excerpt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

export default StoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerContainer: {
    paddingTop: 40, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', 
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 18,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center', 
    flex: 1, 
  },
  headerRegular: {
    fontWeight: '300',
    color: '#ccc',
  },
  headerGradient: {
    color: '#EB9D06',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  card: {
    borderWidth: 2,
    borderColor: '#EB9D06',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    color: '#EB9D06',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardExcerpt: {
    color: '#ccc',
    marginTop: 5,
    fontSize: 14,
  },
});