import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {imageurl} from '../constants/config';

const {height, width} = Dimensions.get('window');
// eslint-disable-next-line react/prefer-stateless-function
class ProfileActivityAlbums extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: 0,
    };
    this.onContentSizeChange = this.onContentSizeChange.bind(this);
  }
  // componentWillReceiveProps(b) {
  //   console.log(b.albumslist);
  // }

  onContentSizeChange(contentWidth, contentHeight) {
    this.setState({screenHeight: contentHeight});
  }

  render() {
    const {albumslist} = this.props;
    const {screenHeight} = this.state;
    const scrollEnabled = screenHeight > height;
    return (
      <View style={styles.backgroundStyle}>
        <FlatList
          data={albumslist.albums}
          initialNumToRender={2}
          numColumns={3}
          keyExtractor={item => item.post_id}
          scrollEnabled={scrollEnabled}
          //   onViewableItemsChanged={this.onContentSizeChange}
          onContentSizeChange={this.onContentSizeChange}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                const type = item.type === 'picture' ? 'photo' : item.type;
                // console.warn(item)
                this.props.navigation.push('PostDetails', {
                  type,
                  postid: item.post_id,
                  profile_thumb: '',
                });
              }}>
              {item.type === 'photo' || item.type === 'picture' ? (
                <ImageBackground
                  style={styles.imageStyle}
                  loadingIndicatorSource={<ActivityIndicator />}
                  progressiveRenderingEnabled
                  source={{uri: `${imageurl}/${item.path}`}}>
                  <View style={{flex: 1}}>
                    {/* <FontAwesome5 name="video" color="white" /> */}
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{color: 'white', fontSize: 10}}>
                        {item.likes}
                      </Text>
                      <FontAwesome5 name="heart" color="red" solid />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{color: 'white', fontSize: 10}}>
                        {item.comments}
                      </Text>
                      <FontAwesome5 name="comment" color="red" solid />
                    </View>
                  </View>
                </ImageBackground>
              ) : (
                <Image
                  source={require('../images/media-default-thumbnail-url-video.png')}
                  style={styles.imageStyle}
                />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageStyle: {
    borderRadius: 20,
    width: 100,
    height: 100,
    overflow: 'hidden',
    margin: 10,
    padding: 5,
    // alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  albumslist: state.profileAlbums.albums,
});

export default connect(mapStateToProps)(withNavigation(ProfileActivityAlbums));
