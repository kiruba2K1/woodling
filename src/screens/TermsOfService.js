import React from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {FAB} from 'react-native-paper';
import RedBanner from '../images/red-banner.png';
import ListHeader from '../components/TermsandConditions.js/ListHeader';
import ListContent from '../components/TermsandConditions.js/ListContent';
import TextView from '../components/TextView';

const DATA = [
  {
    title: 'Our Services',
    number: 1,
    data: [
      `<b style="font-family: Poppins;">Our mission is to create a comprehensive network of Entertainment Industry Professionals and Aspirants within the African continent and beyond by building a community and bringing the industry closer together. In order to realize this, we work tirelessly to provide the products and services described below to you:</b>`,
    ],
  },
  {
    title:
      'Connect with Creatives, Projects and Organizations that will Benefit You and Your Business',
    number: 2,
    data: [
      '<b style="font-family: Poppins;">We help you connect with creatives, networks, guilds, associations, businesses, organizations, and others that matter to you across the Woodlig Network and in the industry in general. We use the information we have to make recommendations to you and recommend you to others, for example, groups and circles to join, events to attend, accounts to follow or send a message to, shows or programs to watch, as well as other creatives or organizations that may need your service and people who you may want to become friends with.</b>',
    ],
  },
  {
    title: 'Personalized Experience',
    number: 3,
    data: [
      '<b style="font-family: Poppins;">Your experience on Woodlig will be a unique one. We make use of your information from posts, circles you are a part of, events, ads you respond to and other content that you view as well as the Pages and people you follow, our system also learns from things such as Interests, skills and your Location. We use the information for example, your connections, choices and settings you select, and what you post and do to make your experience a unique one.</b>',
    ],
  },
  {
    title: 'Restrict harmful conduct, and protect and support our community',
    number: 4,
    data: [
      '<b style="font-family: Poppins;">Safety and security within the community is a priority on Woodlig. We dedicate major resources in detecting misuse, harmful conduct towards others and make protecting our community a priority. We take appropriate action against content like these, which may include but not limited to, offering help, blocking access to certain features, deleting content, disabling an account or reporting to law enforcement.</b>',
    ],
  },
  {
    title: 'Give you the right platform to showcase your talent or business',
    number: 5,
    data: [
      '<b style="font-family: Poppins;">Woodlig has diverse channels for you to showcase your talent or business– for example, choosing your skills sets and interest, sharing status updates, photos, videos and products on Woodlig, sending messages to people, creating events or circles, or adding content to your profile. We will always work towards coming up with new ways for people to use woodlig, such as augmented reality camera and production quality features for you to share more creative content on Woodlig.</b>',
    ],
  },
  {
    title:
      'Discover content, products, services and opportunities that may interest you:',
    number: 6,
    data: [
      '<b style="font-family: Poppins;">Through the content stream, casting calls, marketplace, adverts, promotions and other sponsored content you view on Woodlig, you will be able to discover content, products and services that are offered by the many individuals and businesses that use Woodlig. We have marketing partners, companies and users who pay for their content to reach more of their relevant audience, and we design our services so that the promoted content you see is as relevant and useful to you like everything else that you see on Woodlig.</b>',
    ],
  },
  {
    title: 'Consistent Experiences',
    number: 7,
    data: [
      '<b style="font-family: Poppins;">Woodlig helps help you connect talent and decision makers, as individuals, in circles, businesses, organizations, and products that are relevant to you. We can make use of information about your interests to make it easier for you to connect with the right people or find the right products.</b>',
    ],
  },
  {
    title: 'Improve the Technology',
    number: 8,
    data: [
      '<b style="font-family: Poppins;">We will continuously develop features that will learn to automatically identify and remove dangerous content or activity targeting a user or harmful or abusive to a group or the whole community.</b>',
    ],
  },
];

const {width, height} = Dimensions.get('window');
const TermsOfService = () => {
  return (
    <View style={styles.root}>
      <SafeAreaView>
        <Text text='Okay' />
      </SafeAreaView>
      <SectionList
        ref={ref => (this.scrollRef = ref)}
        sections={DATA}
        stickySectionHeadersEnabled
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => <ListContent body={item} />}
        renderSectionHeader={({section: {title, number}}) => (
          <ListHeader title={title} number={number} />
        )}
      />
      <FAB
        style={styles.fab}
        icon={() => <Icon name="chevron-down" color="#fb0201" size={25} />}
        onPress={() =>
          this.scrollRef.scrollToLocation({animated: true, itemIndex: 15})
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignContent: 'center',
  },
});

export default TermsOfService;
