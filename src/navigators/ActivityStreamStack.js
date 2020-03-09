import {createStackNavigator} from 'react-navigation';
import React from 'react';
import {View, Text, StatusBar} from 'react-native';
import {Appbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ActivityStreamScreen from '../screens/ActivityStreamScreen';
import NewPostScreen from '../screens/NewPostScreen';
import OnYourMindScreen from '../screens/OnYourMindScreen';
import AddLocationRoute from '../screens/AddLocationScreen';
import TagPeopleScreen from '../screens/TagPeopleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ExploreHashtags from '../screens/ExploreHashtags';
import ExploreEventsScreen from '../screens/ExploreEventsScreen';
import RatingsScreen from '../screens/RatingsScreen';
import FinalPostDetails from '../screens/FinalPostDetails';
import PostCommentsScreen from '../screens/PostCommentsScreen';
import ReportPost from '../screens/ReportPost';
import FAQ from '../screens/Faq';
import MessagingScreen from '../screens/MessagingScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import MessagingStack from './MessagingStack';
import GroupMessagingScreen from '../screens/GroupMessagingScreen';
import ViewPeopleToMessage from '../screens/ViewPeopleToMessage';
import Settings from '../screens/Settings';
import SettingsProfile from '../screens/SettingsProfile';
import SettingsPrivacy from '../screens/SettingsPrivacy';
import SettingsNotifications from '../screens/SettingsNotifications';
import SettingsAccount from '../screens/SettingsAccount';
import SettingsAbout from '../screens/SettingsAbout';
import SettingsSharing from '../screens/SettingsSharing';
import SettingsHelp from '../screens/SettingsHelp';
import Wallet from '../screens/Wallet';
import Notifications from '../screens/Notifications';
import PromotionsInsights from '../screens/PromotionsInsights';
import AddFunds from '../screens/AddFunds';
import PaymentScreen from '../screens/PaymentScreen';
import PremiumMembership from '../screens/PremiumMembership';
import SettingsExperience from '../screens/SettingsExperience';
import EditExperience from '../screens/EditExperience';
import SelectSkillType from '../screens/SelectSkillType';
import CreateCircleScreen from '../screens/CreateCircleScreen';
import ChooseCategory from '../screens/ChooseCategory';
import UpdatePasswordScreen from '../screens/UpdatePasswordScreen';
import PostCommentsReply from '../screens/PostCommentsReply';
import ChooseAudience from '../screens/ChooseAudience';
import UserPromotions from '../screens/UserPromotions';
import ProfileRatingsScreen from '../screens/ProfileRatingsScreen';
import CirclesAdmin from '../screens/CirclesAdmin';
import SearchChatUser from '../screens/SearchChatUser';
import PaymentOptions from '../screens/PaymentOptions';
import SettingsAboutDetails from '../screens/SettingsAboutDetails';
import Reported from '../screens/Reported';
import BlockedAccount from '../screens/BlockedAccount';
import PaymentOptionsWallet from '../screens/PaymentOptionsWallet';
import ReCreatePromotion from '../screens/ReCreatePromotion';

const ActivityStreamStack = createStackNavigator(
  {
    ActivityStream: {
      screen: ActivityStreamScreen,
    },
    OnYourMindScreen: {screen: OnYourMindScreen},
    NewPostScreen: {
      screen: NewPostScreen,
    },
    AddLocationRoute: {
      screen: AddLocationRoute,
      navigationOptions: ({navigation}) => ({
        headerTitle: 'Add Location',
      }),
    },
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },

    ReportPost: {
      screen: ReportPost,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ReportSent: {
      screen: Reported,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsFAQ: {
      screen: FAQ,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },

    BlockedAccount: {
      screen: BlockedAccount,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },

    BlockedAccount: {
      screen: BlockedAccount,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsProfile: {
      screen: SettingsProfile,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsAccount: {
      screen: SettingsAccount,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsExperience: {
      screen: SettingsExperience,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    UpdatePassword: {
      screen: UpdatePasswordScreen,
      navigationOptions: ({navigation}) => ({
        headerTitle: 'Change Password',
      }),
    },
    EditExperience: {
      screen: EditExperience,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SelectSkillType: {
      screen: SelectSkillType,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsPrivacy: {
      screen: SettingsPrivacy,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsAbout: {
      screen: SettingsAbout,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsAboutDetails: {
      screen: SettingsAboutDetails,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsNotifications: {
      screen: SettingsNotifications,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsSharing: {
      screen: SettingsSharing,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SettingsHelp: {
      screen: SettingsHelp,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    Wallet: {
      screen: Wallet,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    UserPromotions: {
      screen: UserPromotions,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ProfileRatingsScreen: {
      screen: ProfileRatingsScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    PremiumMembership: {
      screen: PremiumMembership,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    PaymentMethods: {
      screen: PaymentOptions,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    AddFunds: {
      screen: AddFunds,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    PaymentScreen: {
      screen: PaymentScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    PaymentOptions: {
      screen: PaymentOptions,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    PaymentOptionsWallet: {
      screen: PaymentOptionsWallet,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    RatingsScreen: {
      screen: RatingsScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ExploreScreen: {
      screen: ExploreScreen,
      navigationOptions: {
        header: null,
      },
    },
    ExploreHashtags: {
      screen: ExploreHashtags,
    },
    ProductDetails: {
      screen: ProductDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ReCreatePromotion: {
      screen: ReCreatePromotion,
      navigationOptions: ({navigation}) => ({
        header: (
          <Appbar.Header statusBarHeight={12}>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Re-Create Promotion" />
            <Appbar.Action
              icon="check"
              onPress={() => navigation.state.params.onChange()}
            />
          </Appbar.Header>
        ),
      }),
    },
    MessagingStack: {
      screen: MessagingStack,
      navigationOptions: ({navigation}) => ({
        header: (
          <Appbar.Header statusBarHeight={12}>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Messages" />
            <Appbar.Action
              icon="search"
              onPress={() => navigation.navigate('SearchChatUser')}
            />
          </Appbar.Header>
        ),
      }),
    },
    // PaymentOptions: {
    //   screen: PaymentOptions,
    // },
    MessagingScreen: {
      screen: MessagingScreen,
    },
    Notifications: {
      screen: Notifications,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    PromotionsInsights: {
      screen: PromotionsInsights,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ViewPeopleToMessage: {
      screen: ViewPeopleToMessage,
    },
    SearchChatUser: {
      screen: SearchChatUser,
    },
    GroupMessage: {
      screen: GroupMessagingScreen,
    },
    CreateACircle: {
      screen: CreateCircleScreen,
      navigationOptions: {
        header: null,
      },
    },
    AddCircleMembers: {
      screen: ChooseCategory,
      navigationOptions: {
        header: null,
      },
    },
    ExploreEvents: {
      screen: ExploreEventsScreen,
    },
    PostDetails: {
      screen: FinalPostDetails,
      navigationOptions: {
        header: null,
      },
    },
    PostComments: {
      screen: PostCommentsScreen,
      navigationOptions: {
        header: null,
      },
    },
    PostCommentsReply: {
      screen: PostCommentsReply,
      navigationOptions: {
        header: null,
      },
    },
    TagPeopleScreen: {
      screen: TagPeopleScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ChooseAudience: {
      screen: ChooseAudience,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    CirclesAdmin: {
      screen: CirclesAdmin,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
  },
  {
    initialRouteName: 'ActivityStream',
  },
);

// const ActivityStreamStack = createAppContainer(BottomTab);

ActivityStreamStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

export default ActivityStreamStack;
