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
      `<b style="font-family: Poppins;">As Woodlig is a business-oriented community targeted at a specific market, other users would relate better and feel safer if they know that they are relating to real people. Therefore, we urge you to adhere to the following.
        <br>
    <div style="padding-bottom: 0">
      <p style="color: #dedede; text-align: center;">User Information:<br></p>
      </div>

      Use your real names and/or pseudonyms (nicknames).
      Provide the correct personal information.
      You can responsibly create multiple accounts.
      Do not give access to, transfer or share your Woodlig password or account to anyone else, (without our permission).


      You cannot use Woodlig if:
      You are under 16 years old. In which case you will need your agent or another legal representative to use Woodlig on your behalf.
      You have been barred from by applicable laws.
      We've deactivated your account for violating our Terms or Policies.


      What you can share and do on Woodlig
      Woodlig users are free to express themselves and to share content that is important to them and showcase their work at the same time. This must not be at the expense of the safety of others or the integrity of our community. You, therefore, agree not to engage in the conduct described below (or to facilitate or support others in doing so):
      You should not use our Woodlig to do or share anything that is:
      Pornographic material of any kind
      Unlawful, misleading, discriminatory or Hateful.
      Fraudulent or promote any unlicensed financial programs like Ponzi schemes or scams.
      That infringes someone else's rights.
      You may not upload hacks, viruses or malicious code, or do anything that could disable or impair the proper working or appearance of Woodlig.
      You may not use any automated means (without our prior permission) of mining or scraping data from Woodlig or attempt to access data that you do not have permission for.
      We can remove content that you share in breach of these provisions and, if applicable, we may take action against your account. We may also disable your account if you repeatedly infringe other people's intellectual property rights.
      To bring any of these to our attention and help support our community, we encourage you to report content or conduct that you believe breaches your rights or our terms and policies to webmaster@woodlig.com

      Following on Woodlig
      Following users is the first step in engaging with people on Woodlig and getting the right feeds and know what's happening with the topics or people you are interested in. To prevent spam, there are limits regarding how many Woodlig users you can follow at a given time. Also, because follow relationships on Woodlig aren't mutual by nature, we've also put into place a few rules around follow behaviour to promote authentic experiences.

      There are some limits as to how many users you can follow in a given time.
      This is different for every user and is based on your following to follower ratio.
      Abuse may cause the suspension of your account. Specifically, the rules prohibit:
      "follow stir" – following and then unfollowing large numbers of accounts to inflate one's, follower count;
      haphazard following – following and/or unfollowing a large number of unrelated accounts in a short period, particularly by automated means;
      duplicating another account's followers, particularly using automation; and
      Using or promoting third-party services or apps who claim to add followers.</b>`,
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
];

const {width, height} = Dimensions.get('window');
const UserAgreement = () => {
  return (
    <View style={styles.root}>
      <SafeAreaView>
        <TextView text='Okay' />
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

export default UserAgreement;
