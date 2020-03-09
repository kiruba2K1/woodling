/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import fontelloConfig from '../config.json';
import {Switch, Portal, Modal} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const Customon = createIconSetFromFontello(fontelloConfig);
import {createIconSetFromFontello} from 'react-native-vector-icons';
// import {Avatar} from 'react-native-paper';
import axios from 'axios';
import {connect} from 'react-redux';
import {apiurl, imageurl} from '../constants/config.js';

class FindTalentRequest extends Component {
  state = {
    notes: '',
    loading: false,
    lastNote: [],
  };
  componentDidMount() {
    const {navigation, user_id} = this.props;
    const detail = navigation.getParam('detail');
    axios
      .get(
        `${apiurl}fetch-starred-notes.php?user_id=${user_id}&starred_user_id=${detail.id}`,
      )
      .then(res => {
        // console.log(res.data);
        this.setState({
          lastNote: res.data,
          notes: res.data.starred_note.notes,
        });
      })
      .catch(res => console.log(res.data));
    console.log(detail);
  }

  onSubmit = () => {
    const {navigation, user_id} = this.props;
    const detail = navigation.getParam('detail');
    const {notes} = this.state;
    this.setState({loading: true});
    axios
      .post(
        `${apiurl}add-starred-notes.php?user_id=${user_id}&starred_user_id=${detail.id}&notes=${notes}`,
      )
      .then(res => {
        // console.log(res.data);
        if (res.data.status === 'success') {
          this.props.navigation.goBack();
        }
        alert(res.data.message);
      })
      .catch(res => alert('Trouble with your network'));
    this.setState({loading: false});
    // alert('submitted');
  };
  render() {
    const {notes, lastNote, loading} = this.state;
    const {navigation} = this.props;
    const detail = navigation.getParam('detail');
    // if (lastNote.status !== undefined) {
    return (
      <View style={styles.container}>
        <Portal>
          <Modal visible={loading} dismissable={false}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color="#fb0201" />
            </View>
          </Modal>
        </Portal>
        <SafeAreaView>
          <View style={styles.header2}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Customon
                  style={styles.arrowback}
                  name="long-arrow-left"
                  size={12}
                />
              </TouchableOpacity>
              <View>
                <Text style={styles.title}>{detail.full_name}</Text>
              </View>
              <View
                style={{
                  marginLeft: -80,
                  display: detail.premium === '0' ? 'none' : 'flex',
                  width: 20,
                  height: 20,
                  backgroundColor: '#fb0201',
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome5 color="#fff" name="crown" size={10} />
              </View>
              <TouchableOpacity onPress={this.onSubmit}>
                <FontAwesome5
                  style={styles.arrowback2}
                  name="check"
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.headerProfile}>
              <Image
                source={
                  detail.profile_thumb === ''
                    ? require('../images/ic_account_circle_red_24px.jpg')
                    : {uri: `${imageurl}/${detail.profile_thumb}`}
                }
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  borderWidth: 2,
                  borderColor: detail.premium === '1' ? '#fb0201' : '#fff',
                }}
              />
            </View>
          </View>
        </SafeAreaView>
        {lastNote.status !== undefined ? (
          <View style={styles.content}>
            <TextInput
              style={styles.TextInputStyleClass}
              value={notes}
              onChangeText={notes => this.setState({notes})}
              underlineColorAndroid="transparent"
              placeholder="Seems very passionate about modelling.
                  Possible candidate for Stranger's Belt."
              placeholderTextColor="#000"
              multiline
            />
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
    // }
    // return <ActivityIndicator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  TextInputStyleClass: {
    // textAlign: 'left',
    marginTop: 19,
    height: 184,
    width: 400,
    textAlignVertical: 'top',
    padding: 15,
    //borderWidth: 0,
    //borderColor: '#dedede',
    // fontStyle: 'italic',
    fontSize: 13,
    // borderRadius: 20,
    backgroundColor: '#ffff',
    // height: 150,
  },
  content: {
    width: Dimensions.get('window').width,
    padding: 20,
    borderTopColor: '#cccc',
    borderTopWidth: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },
  headerProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -3,
  },
  header: {
    width: Dimensions.get('window').width,
    height: 40,
    //backgroundColor: '#ffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: {width: 3, height: 0},
    //elevation: 5,
  },

  header2: {
    width: Dimensions.get('window').width,
    height: 65,
    backgroundColor: '#ffff',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    //flexDirection: 'row',
    //padding: 15,
    paddingTop: 10,
    shadowOffset: {width: 3, height: 0},
    elevation: 5,
  },
  titleHeader: {
    //  width: 375,
    //marginTop: 20,
    height: 112,
    backgroundColor: '#ffffff',
    opacity: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },

  arrowback2: {
    color: '#000',
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
    //alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(FindTalentRequest);
