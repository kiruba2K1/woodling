import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  TextInput,
  Dimensions,
  FlatList,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import {Header, Avatar} from 'react-native-elements';
import {
  Appbar,
  FAB,
  Portal,
  Modal,
  Avatar as PaperAvatar,
} from 'react-native-paper';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {connect} from 'react-redux';
import StarRating from 'react-native-star-rating';
import fontelloConfig from '../config.json';
import {apiurl, imageurl} from '../constants/config';
import FindTalentsCard from '../components/FindTalentsCard';
import FeauturedTalentsAvatar from '../components/FeauturedTalentsAvatar';
import SetupRolesTick from '../components/SetupRolesTick';
import GalleryPosts from '../components/GalleryPosts';
import TextView from '../components/TextView';

import language from '../constants/language.js';

const Customon = createIconSetFromFontello(fontelloConfig);
const {width, height} = Dimensions.get('window');

class FindTalentsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      searchField: '',
      data: [],
      searchResult: [],
      selected: [],
      selectedTalentData: [],
      starUser: false,
      page: 1,
      loading: false,
      lan: 'en',
    };
    this.hideModal = this.hideModal.bind(this);
    this.searchTalents = this.searchTalents.bind(this);
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

  componentDidMount() {
    const {user_id} = this.props;
    this._retrieveData();
    axios
      .get(`${apiurl}fetch-all-talents.php?user_id=${user_id}&page=1`)
      .then(res => {
        console.log('FindTalentsScreen fetch-all-talents');
        this.setState({data: res.data.talents});
      })
      .catch(res => console.log('error reading feautured talents2'));
  }

  onEndReached = () => {
    // Alert.alert('reached');
    const {page, data} = this.state;
    const {user_id} = this.props;
    axios
      .get(`${apiurl}fetch-all-talents.php?user_id=${user_id}&page=${page + 1}`)
      .then(res => {
        console.log('FindTalentsScreen fetch-all-talents by user_id');
        if (res.data.status === 'success') {
          this.setState({data: data.concat(res.data.talents), page: page + 1});
        } else {
          this.setState({data: data.concat([])});
        }
      })
      .catch(res => console.log('error reading feautured talents1'));
  };
  // componentDidUpdate() {
  //   console.log(this.state.data);
  // }

  hideModal() {
    this.setState({visible: false, selectedTalentData: []});
  }

  getData = async e => {
    const {user_id} = this.props;
    this.setState({visible: true, selected: e});
    console.log(e);
    await axios
      .get(
        `${apiurl}fetch-talent-details.php?talent_id=${e.id}&user_id=${user_id}`,
      )
      .then(res => {
        console.log(res.data);
        console.log('FindTalentsScreen fetch-talent-details by talent_details');
        this.setState({selectedTalentData: res.data});
        if (res.data.user_data.starred_status === null) {
          this.setState({starUser: false});
        } else if (isNaN(res.data.user_data.starred_status) === false) {
          this.setState({starUser: true});
        }
      })
      .catch(res => console.log(res.data));
    console.log(e);
  };

  starTalent = () => {
    const {selectedTalentData, selected} = this.state;
    const {user_id} = this.props;
    // console.log(selected);
    console.warn(selectedTalentData);
    selectedTalentData.starred_status = user_id;
    axios
      .get(
        `${apiurl}star-talent.php?talent_id=${selected.id}&user_id=${user_id}`,
      )
      .then(res => {
        alert(res.data.message);
        this.setState({starUser: true});
      })
      .catch(res => console.log('server error'));
  };

  unstarTalent = () => {
    const {user_id} = this.props;
    const {selectedTalentData, selected} = this.state;
    selectedTalentData.starred_status = null;
    console.warn(selectedTalentData);
    axios
      .get(
        `${apiurl}unstar-talent.php?talent_id=${selected.id}&user_id=${user_id}`,
      )
      .then(res => {
        alert(res.data.message);
        this.setState({starUser: false});
      })
      .catch(res => console.log('server error'));
  };

  searchTalents = async text => {
    this.setState({searchField: text, loading: true});
    await axios
      .get(`${apiurl}search-talents.php?name=${text}`)
      .then(res => {
        console.warn(res.data);
        if (res.data.status === 'success') {
          this.setState({searchResult: res.data.talents});
        }
      })
      .catch(res => console.warn(res.data));
    this.setState({loading: false});
  };

  render() {
    const {profilepicture, user_id} = this.props;
    const {
      visible,
      data,
      selected,
      selectedTalentData,
      starUser,
      lan,
    } = this.state;
    // const startus = isNaN(selectedTalentData.user_data.starred_status);
    return (
      <View style={{flex: 1}}>
        <Portal>
          <Modal
            visible={visible}
            contentContainerStyle={{
              position: 'absolute',
              bottom: 50,
              right: 30,
            }}
            onDismiss={this.hideModal}>
            <View style={styles.modalStyle}>
              <View
                style={{
                  flex: 3,
                  justifyContent: 'space-between',
                  padding: 20,
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View // selectedTalentData.starred_status = user_id;
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      alignContent: 'flex-end',
                    }}>
                    <View style={{alignSelf: 'flex-start'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            visible: false,
                            selectedTalentData: [],
                          })
                        }>
                        <FontAwesome5 name="times" size={20} color="#000" />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={selected.rating}
                        starSize={15}
                        fullStarColor="red"
                        starStyle={{width: 18}}
                      />
                    </View>
                  </View>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <PaperAvatar.Image
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 3,
                        overflow: 'hidden',
                        borderColor:
                          selected.premium === '1' ? '#fb0201' : '#ffffff',
                      }}
                      source={
                        selected.profile_thumb === ''
                          ? require('../images/ic_account_circle_24px.jpg')
                          : {uri: `${imageurl + '/' + selected.profile_thumb}`}
                      }
                      size={70}
                    />
                  </View>
                  <View style={{justifyContent: 'space-between', flex: 1}}>
                    <View style={{alignSelf: 'flex-end'}}>
                      {selectedTalentData.status === 'success' && (
                        <View>
                          {starUser === false ? (
                            <Customon
                              name="like-icon"
                              size={29}
                              color="#000"
                              onPress={this.starTalent}
                            />
                          ) : (
                            <Customon
                              name="like-selected"
                              size={29}
                              color="#fb0201"
                              solid
                              onPress={this.unstarTalent}
                            />
                          )}
                        </View>
                      )}
                    </View>
                    <View style={{alignSelf: 'flex-start'}}>
                      <Text>{selected.gender}</Text>
                    </View>
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#1c1c1c',
                      fontWeight: '900',
                    }}>
                    {selected.full_name}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '500',
                      color: '#1c1c1c',
                      opacity: 0.8,
                      textTransform: 'capitalize',
                      fontSize: 14,
                    }}>
                    {selected.city}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                {/* {selectedTalentData.length === 0 && <ActivityIndicator />} */}
                {selectedTalentData.user_skill_set === '' && (
                  <TextView
                    style={styles.emptyContent}
                    text="This user is yet to indicate his skills"
                  />
                )}
                {selectedTalentData.length !== 0 &&
                  selectedTalentData.user_skil_set !== '' &&
                  typeof selectedTalentData.user_skill_set === 'object' && (
                    <View style={styles.skillsContainer}>
                      {selectedTalentData.user_skill_set.map(e => (
                        <SetupRolesTick
                          key={e.skill_id}
                          roles={e.name}
                          viewStyle={{borderColor: '#fb0201'}}
                          textStyle={{color: '#fb0201'}}
                        />
                      ))}
                    </View>
                  )}
              </View>
              <View style={{flex: 3}}>
                {selectedTalentData.length === 0 && <ActivityIndicator />}
                {selectedTalentData.user_album === '' && (
                  <TextView
                    style={styles.emptyContent}
                    text="This user has not added an album"
                  />
                )}
                {selectedTalentData.length !== 0 &&
                  selectedTalentData.user_album !== '' && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      {selectedTalentData.user_album.map(e => (
                        <GalleryPosts key={e.id} data={e} size={80} />
                      ))}
                    </View>
                  )}
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.profileLink}
                    onPress={() => {
                      // console.warn(selected, user_id);
                      this.props.navigation.navigate('ProfileScreen', {
                        user_id,
                        theirid: selected.id,
                      });
                      this.setState({visible: false});
                    }}>
                    <TextView
                      style={{
                        color: '#ffffff',
                        fontSize: 13,
                        letterSpacing: 0.05,
                        lineHeight: 26,
                      }}
                      text="Visit Profile"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>
        <SafeAreaView>
          <StatusBar
            translucent={false}
            backgroundColor="#ffffff"
            barStyle="dark-content"
          />
          {/* temporory  header for find talents */}
          <View
            style={{
              width,
              height: 50,
              backgroundColor: '#ffffff',
              // justifyContent: 'center',
              // alignItems: 'center',
              elevation: 3,
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 45,
              }}>
              <Customon name="woodlig-brand" color="#fb0201" />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('StarredTalents')
                }>
                <Customon name="like-icon" size={22} color="#fb0201" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        <View
          style={{
            marginBottom: 130,
            backgroundColor: '#eeeeee',
            zIndex: -1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{padding: 15}}>
            <View style={styles.searchSection}>
              <View style={{backgroundColor: 'transparent'}}>
                <TextInput
                  style={styles.searchExtend}
                  placeholder={language.promotions.who_are_you_looking_for(lan)}
                  onChangeText={this.searchTalents}
                />
              </View>
              {!this.state.loading ? (
                <FontAwesome5
                  style={styles.searchIcon}
                  name="search"
                  size={20}
                  color="#000"
                />
              ) : (
                <ActivityIndicator color="#000000" />
              )}
            </View>
          </View>

          <FlatList
            ListHeaderComponent={<FeauturedTalentsAvatar />}
            // contentContainerStyle={{marginTop: 20, paddingBottom: 50}}
            style={{backgroundColor: '#eeeeee'}}
            onEndReached={this.onEndReached}
            data={
              this.state.searchField.length === 0
                ? data
                : this.state.searchResult
            }
            renderItem={({item}) => (
              <FindTalentsCard
                item={item}
                selectedItem={this.getData}
                full_name={item.full_name}
                picture={item.profile_thumb}
                username={item.username}
                rating={item.rating}
              />
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    backgroundColor: 'green',
    margin: 16,
    right: 0,
    top: height - 160,
    zIndex: 100000000000,
  },
  searchSection: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 335,
    height: 41,
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 7,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },

  searchExtend: {
    width: 300,
    height: 41,
    fontSize: 12,
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },
  modalStyle: {
    height: 406,
    width: width - 60,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {width: -3, height: 0},
    shadowRadius: 6,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  skillsContainer: {
    width: width - 80,
    height: 55,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // alignContent: 'center',
    borderRadius: 25,
    elevation: 1,
    backgroundColor: '#ffffff',
  },
  emptyContent: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: 'black',
  },
  profileLink: {
    width: 146,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 6,
    borderRadius: 52,
    backgroundColor: '#fb0201',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(FindTalentsScreen);
