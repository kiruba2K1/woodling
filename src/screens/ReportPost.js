/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fontelloConfig from '../config.json';
import {connect} from 'react-redux';
import CustomModal from '../components/Modal.js';
import Axios from 'axios';
import {apiurl} from '../constants/config.js';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

const options = [
  {
    title: 'Spam',
    body: 'This user is posting irrelevant content and spam...',
  },
  {
    title: 'Profanity/Insults',
    body:
      'This user is making use of slurs and nit censoring their words against..',
  },
  {
    title: 'Threats',
    body: 'This user is making threats of physical violence...',
  },
  {
    title: 'Hate Speech',
    body:
      'This user is making offensive posts against Race, Gender, LGBTQA+...',
  },
  {
    title: 'Malicious Links',
    body: 'This post has dangerous links...',
  },
  {
    title: 'Identity Theft',
    body: 'The user is posting as someone who they are not ...',
  },
  {
    title: 'Pornography',
    body: 'The user is making posts of porno content',
  },
];

class ReportPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.reportPost = this.reportPost.bind(this);
  }
  reportPost = async report => {
    const {navigation, user_id} = this.props;
    const {showModal} = this.state;
    const post_id = navigation.getParam('post_id');
    const data = {user_id, post_id, report};
    this.setState({showModal: true});
    await Axios.post(`${apiurl}report-post.php`, data)
      .then(res => {
        // console.log(res.data);
        if (res.data.status === 'success') {
          this.props.navigation.navigate('ReportSent');
        }
      })
      .catch(res => console.warn(res.data));
    this.setState({showModal: false});
  };
  render() {
    const {showModal} = this.state;
    return (
      <View style={styles.container}>
        <CustomModal visible={showModal} />
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <FontAwesome5
                style={styles.arrowback}
                name="chevron-left"
                size={15}
              />
            </TouchableOpacity>
            <View style={{paddingLeft: 20}}>
              <TextView style={styles.title} text='Report Post' />
              <TextView style={styles.stitle} text="Tell us what's wrong with this post." />
            </View>
          </View>
        </SafeAreaView>

        <ScrollView>
          {options.map(e => (
            <TouchableOpacity onPress={() => this.reportPost(e.title)}>
              <View style={styles.contentLayer}>
                <View style={styles.spaceLayer}>
                  <TextView style={styles.reportTitle} text={e.title} />
                  <FontAwesome5
                    style={styles.arrowback}
                    name="chevron-right"
                    size={15}
                  />
                </View>
                <TextView style={styles.content} text={e.body} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: Dimensions.get('window').width,
    height: 109,
    marginBottom: 10,
    backgroundColor: '#ffff',
    //justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: {width: 3, height: 0},
    elevation: 5,
  },
  spaceLayer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fb0201',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
  stitle: {
    color: '#aeaeae',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    marginTop: -10,
  },
  reportTitle: {
    color: '#1c1c1c',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  contentLayer: {
    //marginTop: 10,
    padding: 30,
    width: Dimensions.get('window').width,
    borderWidth: 0.9,
    //height: 118,
    //borderRadius: 1,
    borderTopColor: '#dedede',
    borderBottomColor: '#dedede',
    //  borderColor: '#dedede',
  },
  content: {
    paddingBottom: 8,
    color: '#808080',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  arrowback: {
    color: '#000',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
});

export default connect(mapStateToProps)(ReportPost);
