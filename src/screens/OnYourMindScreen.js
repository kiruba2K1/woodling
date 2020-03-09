import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  AsyncStorage,
} from 'react-native';
import axios from 'axios';
import * as Progress from 'react-native-progress';
import {Portal, Modal} from 'react-native-paper';
import {Avatar, Header} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {imageurl, apiurl} from '../constants/config';
import {
  viewActivityStream,
  clearActivityStream,
} from '../redux/actions/viewActivityStream';
import Blurbg from '../images/Blur.png';
import PremiumAvatar from '../components/PremiumAvatar';
import TextView from '../components/TextView';
import {
  PowerTranslator,
  ProviderTypes,
  TranslatorConfiguration,
  TranslatorFactory,
} from 'react-native-power-translator';

const {height, width} = Dimensions.get('window');
import language from '../constants/language.js';
// eslint-disable-next-line react/prefer-stateless-function
class OnYourMindScreen extends Component {
  static navigationOptions = {
    title: 'OnYourMind',
    header: null,
  };

  async function() {
    const variable = 'How are you?';
    TranslatorConfiguration.setConfig(
      ProviderTypes.Google,
      'AIzaSyB4IiebZ2y0IKH8JhxTI7HJeI8t2FO1iIA',
      'fr',
      'en',
    );
    const translator = TranslatorFactory.createTranslator();

    if (translator != undefined && variable != undefined) {
      const respose = await translator.translate(variable);
      return respose;
    } else {
      return variable;
    }
    return 'test' + variable;
  }

  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      description: '',
      location: '',
      people: '',
      longlat: [],
      loading: false,
      status: '',
    };
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if (value == 'fr') {
          this.setState({
            lan: 'fr',
          });
        } else {
          this.setState({
            lan: 'en',
          });
        }
      } else {
        alert('Else exicute : ' + value);
      }
    } catch (error) {
      //alert("error");
      console.log('--------- Error', error);
      // Error retrieving data
    }
  };

  componentWillReceiveProps(a) {
    console.warn(a.location);
  }

  async handleSubmit() {
    // this.setState({ loading: true });
    const {description} = this.state;
    const {location, tag, user_id, navigation} = this.props;
    const {formatted_address, lng, lat, city, country} = location;
    const stringifyTaggedPeople = tag.map(element => element.id).toString();
    // console.log(tags);
    const data = {
      type: 'text',
      privacy: 'public',
      description,
      people: stringifyTaggedPeople,
      lat,
      lng,
      country,
      formatted_address,
      city,
    };
    // console.log(data);
    this.setState({loading: true});
    await axios
      .post(`${apiurl}add-post.php?user_id=${user_id}`, data)
      .then(res => {
        if (res.data.status === 'success') {
          this.props.clearActivityStream();
          this.props.viewActivityStream(data);
          alert(res.data.message);
          navigation.goBack();
        } else {
          alert(res.data.message);
        }
      })
      .catch(res => console.log('not read'));
    this.setState({loading: false});
  }

  render() {
    const {username, profilepicture, tag, lan} = this.props;
    const {loading} = this.state;
    return (
      <ScrollView>
        <Portal>
          <Modal visible={loading}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" color="#fb0201" />
            </View>
          </Modal>
        </Portal>
        <ImageBackground source={Blurbg} style={{height, width}}>
          <StatusBar backgroundColor="transparent" />
          <View style={{flex: 1}}>
            <View style={{flex: 1, justifyContent: 'space-around'}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name="times"
                  size={20}
                  color="black"
                  style={{paddingLeft: 20}}
                  style={{paddingTop: 50, paddingLeft: 25}}
                />
              </TouchableOpacity>
              <TextView
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: 'black',
                  textAlign: 'center',
                }}
                text="What are you up to?"></TextView>
            </View>
            <View
              style={{
                flex: 4.5,
                backgroundColor: 'white',
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.39,
                shadowRadius: 8.3,
                elevation: 13,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <PremiumAvatar
                  source={
                    this.props.profilepicture === ''
                      ? undefined
                      : this.props.profilepicture
                  }
                />
                <Text
                  style={{
                    textAlignVertical: 'center',
                    color: '#bcc5d3',
                    fontFamily: 'Poppins',
                    marginLeft: 5,
                  }}>
                  @{username}
                </Text>
              </View>
              <View>
                <TextInput
                  onChangeText={text => this.setState({description: text})}
                  value={this.state.description}
                  placeholder={language.promotions.nothing(lan)}
                  multiline
                  style={styles.inputField}
                />
              </View>
              {/* <View style={{ flexDirection: 'row', marginLeft: '5%', marginTop: 10 }}>
                <Icon name="paperclip" size={20} />
                <Text style={{ fontSize: 15 }}> Attach</Text>
              </View> */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  justifyContent: 'space-around',
                  marginTop: 30,
                }}>
                {/* <TouchableOpacity
                  onPress={() =>
                    this.setState({description: `${this.state.description} #`})
                  }
                  style={{flexDirection: 'row', alignContent: 'center'}}>
                  <Icon name="plus" size={15} color="black" />
                  <Text style={{color: 'black'}}> Add Hashtag</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('TagPeopleScreen')
                  }
                  style={{flexDirection: 'row', alignContent: 'center'}}>
                  <Icon name="plus" size={15} color="black" />
                  <TextView style={{color: 'black'}} text="Tag People">
                    {' '}
                  </TextView>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('AddLocationRoute')
                  }
                  style={{flexDirection: 'row', alignContent: 'center'}}>
                  <Icon name="plus" size={15} color="black" />
                  <TextView style={{color: 'black'}} text="Add Location">
                    {' '}
                  </TextView>
                </TouchableOpacity>
              </View>
              <View style={{paddingLeft: 25, paddingTop: 10}}>
                <View style={{flexDirection: 'row', paddingVertical: 10}}>
                  <Icon name="map-marker-alt" color="#fb0201" />
                  <Text>
                    &nbsp;&nbsp;{this.props.location.formatted_address}
                  </Text>
                </View>
                <View>
                  <TextView text="With:"></TextView>
                  {tag.length <= 2 ? (
                    <View style={{flexDirection: 'row'}}>
                      {tag.map((e, index) => (
                        <Text key={e.id}>
                          &nbsp;{e.username}
                          {tag.length - 1 > index ? ',' : ' '}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      {tag.slice(0, 2).map((e, index) => (
                        <Text key={e.id}>
                          &nbsp;{e.username}
                          {tag.length - 2 > index ? ',' : ' '}
                        </Text>
                      ))}
                      <Text>and {tag.length - 2} more&nbsp;</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={{alignItems: 'center', marginTop: 36}}>
                <TouchableOpacity
                  onPress={this.handleSubmit.bind(this)}
                  style={styles.submitTouch}
                  disabled={this.state.description.length < 2}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#fb0201', '#ff4b4a']}
                    style={[
                      styles.linearGradient,
                      {opacity: this.state.description.length < 2 ? 0.5 : 1},
                    ]}>
                    {this.state.loading === true ? (
                      <Progress.CircleSnail
                        color="white"
                        size={20}
                        indeterminate
                        indeterminateAnimationDuration={4000}
                      />
                    ) : (
                      <TextView style={styles.btnText} text="Post"></TextView>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              {/* <View style={{alignItems: 'center'}}>
                {this.state.loading === true ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 30,
                      marginTop: 30,
                      backgroundColor: 'red',
                      width: 105,
                      height: 30,
                    }}>
                    <Progress.CircleSnail
                      color="white"
                      size={20}
                      indeterminate
                      indeterminateAnimationDuration={4000}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={this.handleSubmit.bind(this)}
                    activeOpacity={0.5}
                    style={{
                      backgroundColor: '#fb0201',
                      paddingTop: 5,
                      paddingBottom: 5,
                      paddingLeft: 40,
                      paddingRight: 40,
                      borderRadius: 30,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 1,
                        height: 4,
                      },
                      shadowOpacity: 1,
                      shadowRadius: 16.0,
                      elevation: 4,
                      marginTop: 30,
                    }}>
                    <Text style={{color: 'white'}}>Post</Text>
                  </TouchableOpacity>
                )}
              </View> */}
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  submitTouch: {
    width: 109,
    height: 32,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.31)',
    shadowOffset: {width: 1, height: 0},
    shadowRadius: 6,
    borderRadius: 25,
  },
  linearGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  inputField: {
    borderWidth: 1,
    textAlignVertical: 'top',
    borderColor: '#dedede',
    width: '90%',
    height: 200,
    padding: 20,
    paddingTop: 20,
    alignSelf: 'center',
  },
});

const mapStateToProps = state => ({
  location: state.addpost.locationdescription,
  tag: state.addpost.taggedpeople,
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  username: state.profilepicture.username,
});

export default connect(mapStateToProps, {
  viewActivityStream,
  clearActivityStream,
})(OnYourMindScreen);
