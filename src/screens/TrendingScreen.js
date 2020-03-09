import React, {Component} from 'react';
import axios from 'axios';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import {
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Header, Avatar} from 'react-native-elements';
import {Appbar} from 'react-native-paper';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ScrollView} from 'react-native-gesture-handler';
import {localurl, apiurl, imageurl} from '../constants/config';
import ActivityStream from '../components/ActivityStream';
import {
  viewActivityStream,
  clearActivityStream,
} from '../redux/actions/viewActivityStream';
import TextView from '../components/TextView';

import fontelloConfig from '../config.json';
import BonApetitCards from '../components/BonApetitCards';
import {mockActivity} from '../constants/MockData';

const Customon = createIconSetFromFontello(fontelloConfig);
const {width, height} = Dimensions.get('window');

class TrendingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trendingTags: [],
      trendingTexts: [],
      bapPage: 1,
      bonAppetit: [],
    };
  }

  componentDidMount() {
    // console.log(mockActivity);
    const {user_id} = this.props;
    axios
      .get(`${apiurl}fetch-trending-tags.php?trending=1&user_id=${user_id}`)
      .then(res => {
        console.log('Trending fetch-trending-tags:', res.data);
        this.setState({trendingTags: res.data.data});
      })
      .catch(res => console.log(res.data));

    axios
      .get(`${apiurl}fetch-trending-text-posts.php?user_id=${user_id}`)
      .then(res => {
        console.log('Trending fetch-trending-text-posts:', res.data);
        this.setState({trendingTexts: res.data});
      })
      .catch(res => console.log(res.data));

    axios
      .get(`${apiurl}fetch-trending-bon-appetit.php?user_id=${user_id}&page=1`)
      .then(res => {
        console.log('Trending fetch-trending-bon-appetit.php:', res.data);
        if (res.data.data === undefined) {
          return this.setState({bonAppetit: []});
        }
        this.setState({bonAppetit: res.data.data});
      })
      .catch(res => console.log(res.data));
  }

  loadMoreBonAppetit = async () => {
    const {user_id} = this.props;
    const {bapPage, bonAppetit} = this.state;
    await axios
      .get(
        `${apiurl}fetch-trending-bon-appetit.php?user_id=${user_id}&page=${bapPage +
          1}`,
      )
      .then(res => {
        console.warn(res.data);
        if (res.data.data === undefined) {
          return this.setState({bonAppetit});
        }
        this.setState({
          bonAppetit: bonAppetit.concat(res.data.data),
          bapPage: bapPage + 1,
        });
      })
      .catch(res => console.warn(res.data));
  };

  _renderItem({item, index}, parallaxProps) {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={require('../images/casting_call_image.jpg')}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
      </View>
    );
  }

  render() {
    const {user_id, profilepicture} = this.props;
    const {trendingTags, trendingTexts, bonAppetit} = this.state;
    return (
      <View style={{flex: 1}}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="#ffffff"
        />
        <Appbar.Header
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowRadius: 6,
            elevation: 5,
          }}>
          <Image
            source={require('../images/woodlig-logo-alt-image.png')}
            resizeMode="contain"
            style={{width: 46, height: 11}}
          />
        </Appbar.Header>
        <FlatList
          data={bonAppetit}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={this.loadMoreBonAppetit}
          ListHeaderComponent={
            <View>
              <View
                style={{
                  height: 216,
                  width,
                  backgroundColor: '#ffffff',
                  justifyContent: 'center',
                }}>
                <View style={{padding: 15}}>
                  <TextView
                    style={{fontFamily: 'Poppins-Medium', fontSize: 12}}
                    text="Featured ads"></TextView>
                </View>
                <Carousel
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={[1, 2, 3, 4]}
                  renderItem={this._renderItem}
                  slideStyle={{
                    justifyContent: 'center',
                  }}
                  sliderWidth={width}
                  itemWidth={width - 60}
                  layout="default"
                  hasParallaxImages
                  // itemHeight={141}
                />
              </View>
              <View style={{alignItems: 'center', marginVertical: 20}}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    elevation: 3,
                    padding: 10,
                    borderRadius: 5,
                    width: width - 60,
                    backgroundColor: 'white',
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('SearchScreen')
                  }>
                  <TextView
                    style={{color: 'black'}}
                    text="Search People, hashtags etc"></TextView>
                  <FontAwesome5 name="search" color="#000000" />
                </TouchableOpacity>
              </View>
              <View style={{paddingHorizontal: 20}}>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TextView
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: '#000',
                      fontFamily: 'Poppins-Medium',
                    }}
                    text="Trending"></TextView>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() =>
                        this.props.navigation.navigate('ExploreHashtags')
                      }>
                      <TextView
                        style={{
                          color: 'black',
                          fontSize: 10,
                          fontFamily: 'Poppins-Medium',
                          marginRight: 5,
                        }}
                        text="View popular hashtags"></TextView>
                      <FontAwesome5 name="arrow-right" color="#000000" />
                    </TouchableOpacity>
                  </View>
                </View> */}
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    // height: 300,
                  }}>
                  {trendingTags.map((e, index) => (
                    <ImageBackground
                      key={e.id}
                      source={require('../images/trendingInBg.webp')}
                      style={{
                        height: 100,
                        width: 150,
                        marginVertical: 10,
                        borderRadius: 8,
                        overflow: 'hidden',
                      }}
                      resizeMode="cover">
                      <TouchableOpacity
                        onPress={() => {
                          console.warn(e);
                          this.props.navigation.navigate('ViewTaggedPosts', {
                            type: 'hashtags',
                            item: e,
                            searchField: e.title,
                          });
                        }}
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: 17,
                          }}>
                          #{e.title}
                        </Text>
                      </TouchableOpacity>
                    </ImageBackground>
                  ))}
                </View> */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}>
                  <Image
                    source={require('../images/trendingfire.png')}
                    style={{width: 18, paddingRight: 10}}
                  />
                  <TextView
                    style={{
                      color: '#000000',
                      fontSize: 15,
                      fontFamily: 'Poppins-Medium',
                      marginLeft: 7,
                    }}
                    text="Top Posts in Nigeria"></TextView>
                </View>
              </View>
              <View style={{backgroundColor: '#eeeeee'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingTop: 15,
                    paddingRight: 12,
                  }}>
                  <TextView
                    style={{
                      color: 'black',
                      fontSize: 10,
                      fontFamily: 'Poppins-Medium',
                      marginRight: 5,
                    }}
                    text="Swipe"></TextView>
                  <FontAwesome5 name="arrow-right" color="#000000" />
                </View>

                <FlatList
                  data={
                    trendingTexts.data === 'undefined' ? [] : trendingTexts.data
                  }
                  // ListEmptyComponent={<EmptyActivityStream />}
                  // initialNumToRender={2}
                  // onRefresh={() => this.onRefresh()}
                  // refreshing={this.state.isFetching}
                  // viewabilityConfig={this.viewabilityConfig}
                  // onViewableItemsChanged={this.onViewableItemsChanged}
                  horizontal
                  contentContainerStyle={{paddingVertical: 20}}
                  keyExtractor={item => item.post_id}
                  renderItem={({item}) => (
                    <ActivityStream
                      full_name={item.full_name}
                      username={item.username}
                      text={item.body}
                      type="text"
                      address={item.address}
                      path={item.path}
                      event_type={item.event_type}
                      likes={item.likes}
                      like_status={item.like_status}
                      comments={item.comments}
                      profile_thumb={item.profile_thumb}
                      theirid={item.post_user_id}
                      caption={item.caption}
                      postid={item.post_id}
                      datecreated={item.date_created}
                      likestatus={item.like_status}
                      productname={item.product_name}
                      productpurpose={item.product_purpose}
                      productprice={item.product_price}
                      producttype={item.product_type}
                      productid={item.product_id}
                      trending="trending"
                      // activeItem={activeItem}
                      Item={item}
                    />
                  )}
                />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Poppins-Medium',
                  paddingLeft: 20,
                  color: '#000',
                }}>
                Bon Appétit
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <BonApetitCards key={item.post_id} data={item} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: width - 60,
    height: 170,
    alignSelf: 'center',
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    // ...StyleSheet.absoluteFillObject,
    resizeMode: 'stretch',
  },
});
const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  activitystreamdata: state.activitystreamdata.activitystream,
});

export default connect(mapStateToProps, {
  viewActivityStream,
  clearActivityStream,
})(TrendingScreen);
