import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import TextView from './TextView';
import PremiumAvatar from './PremiumAvatar.js';

const Customon = createIconSetFromFontello(fontelloConfig);
class HeaderComponent extends Component {
  render() {
    const {title, size} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Customon
              style={styles.arrowback}
              name="long-arrow-left"
              size={15}
            />
          </TouchableOpacity>
          <TextView style={styles.title} text={title}></TextView>
          <TouchableOpacity>
            <PremiumAvatar
              size={size}
              source={
                this.props.profilepicture === ''
                  ? undefined
                  : this.props.profilepicture
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: {width: 3, height: 0},
    elevation: 5,
  },

  title: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },

  arrowback: {
    color: '#000',
  },

  headerArrow: {
    flex: 1,
  },

  headerTitle: {
    flex: 2,
    marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  location: state.addpost.locationdescription,
  tag: state.addpost.taggedpeople,
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  username: state.profilepicture.username,
});

export default connect(mapStateToProps)(withNavigation(HeaderComponent));
