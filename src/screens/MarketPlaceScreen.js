import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageBackground,
  TextInput,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {Header, Avatar} from 'react-native-elements';
import {Appbar, FAB, Portal, Modal} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {connect} from 'react-redux';
import axios from 'axios';
import fontelloConfig from '../config.json';
import {apiurl, imageurl} from '../constants/config';
import ActivityStream from '../components/ActivityStream';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);
const {width, height} = Dimensions.get('window');

class MarketPlaceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      isSearching: false,
      refreshing: false,
      name: '',
      page: 1,
    };
    this.filterProducts = this.filterProducts.bind(this);
    this.sortProducts = this.sortProducts.bind(this);
    this.textChanged = this.textChanged.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(_, prevState) {
    const {navigation, user_id} = this.props;
    // if (prevState.name !== '' && this.state.name === '') {
    //   axios
    //     .get(`${apiurl}fetch-all-products?user_id=${user_id}&page=1`)
    //     .then(res => this.setState({data: res.data, refreshing: false}))
    //     .catch(res => console.log(res.data));
    // }
  }

  getData = () => {
    const {navigation, user_id} = this.props;
    const filterParam = navigation.getParam('filterParam');
    if (filterParam) {
      axios
        .post(`${apiurl}search-products.php?user_id=${user_id}`, filterParam)
        .then(res => {
          console.warn(res.data);
          this.setState({data: res.data, refreshing: false});
        })
        .catch(res => console.warn(res.data));
    } else {
      axios
        .get(`${apiurl}fetch-all-products.php?user_id=${user_id}&page=1`)
        .then(res => {
          console.log('Market Place Data : ', res.data);
          console.warn(res.data);
          this.setState({data: res.data.data, refreshing: false});
        })
        .catch(res => console.log(res.data));
    }
  };

  textChanged = async text => {
    // console.warn(text);
    const {navigation, user_id} = this.props;
    this.setState({name: text, isSearching: true});
    await axios
      .get(
        `${apiurl}search-products.php?user_id=${user_id}&page=1&name=${text}`,
      )
      .then(res => {
        console.warn(res.data);
        if (res.data.status === 'success') {
          this.setState({data: res.data.data, refreshing: false});
        }
      })
      .catch(res => console.warn(res.data));
    this.setState({isSearching: false});
  };

  onRefresh = () => {
    this.setState({refreshing: false, data: [], page: 1}, () => {
      this.getData();
    });
  };

  async filterProducts(e) {
    const {user_id} = this.props;
    this.setState({loading: true, data: []});
    await axios
      .post(
        `${apiurl}search-products.php?user_id=${user_id}&category=${e}&page=1`,
      )
      .then(res => {
        console.warn(res.data);
        this.setState({data: res.data.data});
      })
      .catch(res => console.warn(res));
    this.setState({loading: false});
  }

  async sortProducts(e) {
    const {user_id} = this.props;
    this.setState({loading: true, data: []});
    await axios
      .post(`${apiurl}search-products.php?user_id=${user_id}&sort=${e}&page=1`)
      .then(res => {
        console.warn(res.data);
        this.setState({data: res.data.data});
      })
      .catch(res => console.warn(res.data));
    this.setState({loading: false});
  }

  onEndReached = () => {
    const {user_id} = this.props;
    const {page} = this.state;
    this.setState({page: page + 1});
    // alert('refreshed');
    axios
      .get(
        `${apiurl}fetch-all-products.php?user_id=${user_id}&page=${page + 1}`,
      )
      .then(res => {
        console.warn(res.data);
        if (res.data.status === 'success') {
          this.setState({
            data: this.state.data.concat(res.data.data),
            refreshing: false,
          });
        }
      })
      .catch(res => console.warn(res.data));
  };

  render() {
    const {profilepicture} = this.props;
    const {data, loading} = this.state;
    if (loading === false) {
      return (
        <View style={{flex: 1}}>
          <StatusBar
            translucent={false}
            backgroundColor="#ffffff"
            barStyle="dark-content"
          />

          {/* <FAB
            style={styles.fab}
            icon={() => <Customon name="filter" color="#fb0201" size={22} />}
            onPress={() => this.props.navigation.navigate('FilterMarketPlace')}
          /> */}
          <FAB
            style={styles.fab}
            icon={() => <Customon name="plus" color="#fb0201" size={22} />}
            onPress={() =>
              this.props.navigation.navigate('NewPostScreen', {
                routeName: 'sale',
              })
            }
          />

          <View>
            <View
              style={{
                backgroundColor: '#dedede',
                paddingVertical: 10,
              }}>
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                }}>
                <View style={{flex: 7}}>
                  <TextInput
                    style={{
                      backgroundColor: '#fff',
                      paddingHorizontal: 10,
                      width: '90%',
                      height: 40,
                    }}
                    onChangeText={this.textChanged}
                    value={this.state.name}
                    placeholder="search here"
                  />
                </View>
                <View style={{flex: 1}}>
                  {!this.state.isSearching ? (
                    <FontAwesome5 name="search" size={20} />
                  ) : (
                    <ActivityIndicator color="#000000" />
                  )}
                </View>
              </View>
            </View>
            <FlatList
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
              ListHeaderComponent={
                <View>
                  <View
                    style={{
                      paddingHorizontal: 20,
                    }}>
                    <TextView text="Categories"></TextView>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <ImageBackground
                        source={require('../images/equip.png')}
                        style={{height: 100, width: 100}}>
                        <TouchableOpacity
                          style={styles.buttonStyle}
                          onPress={() => this.filterProducts('products')}>
                          <TextView
                            style={styles.buttonText}
                            text="Equipments"></TextView>
                        </TouchableOpacity>
                      </ImageBackground>
                      <View style={{justifyContent: 'space-between'}}>
                        <ImageBackground
                          source={require('../images/venue.png')}
                          style={{height: 40, width: 100}}>
                          <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => this.filterProducts('products')}>
                            <TextView
                              style={styles.buttonText}
                              text="Venues"></TextView>
                          </TouchableOpacity>
                        </ImageBackground>
                        <ImageBackground
                          source={require('../images/resources.png')}
                          style={{height: 40, width: 100}}>
                          <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => this.filterProducts('products')}>
                            <TextView
                              style={styles.buttonText}
                              text="Resouces"></TextView>
                          </TouchableOpacity>
                        </ImageBackground>
                      </View>
                      <ImageBackground
                        source={require('../images/services.png')}
                        style={{height: 100, width: 100}}>
                        <TouchableOpacity
                          style={styles.buttonStyle}
                          onPress={() => this.filterProducts('services')}>
                          <TextView
                            style={styles.buttonText}
                            text="Services"></TextView>
                        </TouchableOpacity>
                      </ImageBackground>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 20,
                      }}>
                      <TouchableOpacity style={styles.filterButtons}>
                        <TextView text="Featured"></TextView>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.filterButtons}
                        onPress={() => this.sortProducts('popular')}>
                        <TextView text="Popular"></TextView>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.filterButtons}
                        onPress={() => this.sortProducts('newest')}>
                        <TextView text="New entries"></TextView>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              }
              contentContainerStyle={{marginTop: 20, paddingBottom: 50}}
              style={{backgroundColor: '#eeeeee'}}
              data={data}
              onEndReachedThreshold={1}
              onEndReached={this.onEndReached}
              renderItem={({item}) => (
                <ActivityStream
                  productname={item.name}
                  productpurpose={item.purpose}
                  productprice={item.price}
                  productcurrency={item.currency}
                  address={item.formatted_address}
                  producttype={item.product_type}
                  formatted_address={item.formatted_address}
                  type={item.type}
                  path={item.path}
                  likes={item.likes}
                  like_status={item.like_status}
                  theirid={item.post_user_id}
                  postid={item.post_id}
                  productid={item.product_id}
                  likestatus={item.like_status}
                  Item={item}
                />
              )}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#fb0201" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    backgroundColor: '#fff',
    margin: 16,
    right: 0,
    bottom: 10,
    // top: height - 220,
    zIndex: 100000000000,
  },
  buttonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
    fontSize: 13,
    // fontWeight: '700',
    letterSpacing: 1.47,
  },
  filterButtons: {
    width: 101,
    height: 34,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 6,
    borderRadius: 25,
    backgroundColor: '#ffffff',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  activitystreamdata: state.activitystreamdata.activitystream,
});

export default connect(mapStateToProps)(MarketPlaceScreen);
