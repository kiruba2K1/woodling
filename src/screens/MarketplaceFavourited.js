/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const Customon = createIconSetFromFontello(fontelloConfig);
import fontelloConfig from '../config.json';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {TabNavigator} from 'react-navigation';
import Favourited from '../components/Favourited.js';
import PostedAdvert from '../components/PostedAdvert.js';
import {connect} from 'react-redux';
import {fetchFavoritedProducts} from '../redux/actions/fetchFavoritedProducts';
import {fetchMyPostedAdverts} from '../redux/actions/fetchMyPostedAdverts';
import TextView from '../components/TextView';

const {width, height} = Dimensions.get('window');

class MarketplaceFavourited extends Component {
  state = {
    menuState: 'favourited',
  };

  componentDidMount() {
    this.checkState();
  }
  // componentDidUpdate(prevProps, prevState) {
  //   console.log(this.isMounted());
  // }

  checkState = () => {
    const {navigation} = this.props;
    const status = navigation.getParam('status');
    // this.setState({menuState: status});
    if (status === 'posted') {
      // alert('checked');
      this.showPosted();
      this.scrollref.scrollToEnd({duration: 1000});
    }
  };

  showPosted = () => {
    this.setState({menuState: 'posted'});
    this.scrollref.scrollTo({x: width, y: 0, animated: true});
  };

  showFavourited = () => {
    this.setState({menuState: 'favourited'});
    this.scrollref.scrollTo({x: 0, y: 0, animated: true});
  };

  onScroll = event => {
    if (event.nativeEvent.contentOffset.x > width / 2) {
      this.setState({menuState: 'posted'});
    } else {
      this.setState({menuState: 'favourited'});
    }
    console.log(event.nativeEvent.contentOffset.x);
  };
  render() {
    const {menuState} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content"
          translucent={false}
        />
        <View style={styles.header}>
          <View style={styles.headerArrow}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Customon
                style={styles.arrowback}
                name="long-arrow-left"
                size={15}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerTitle}>
            <TextView style={styles.title} text='Marketplace' />
          </View>
        </View>
        <View
          style={{
            padding: 15,
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            shadowColor: 'rgba(0, 0, 0, 1)',
            elevation: 3,
            shadowOffset: {width: 3, height: 0},
          }}>
          <View
            style={{flex: 1, borderRightWidth: 1, borderRightColor: '#e7e4e9'}}>
            <TouchableOpacity onPress={this.showFavourited}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome5
                  style={styles.like}
                  name="heart"
                  size={21}
                  color={menuState === 'favourited' ? '#fe0000' : '#000'}
                />
                <TextView
                  style={[
                    styles.titleTab,
                    {color: menuState === 'favourited' ? '#fe0000' : '#000'},
                  ]} text='Favourited' />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{flex: 1, borderLeftWidth: 1, borderLeftColor: '#e7e4e9'}}>
            <TouchableOpacity onPress={this.showPosted}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome5
                  style={styles.like}
                  name="file-upload"
                  size={21}
                  color={menuState === 'posted' ? '#fe0000' : '#000'}
                />
                <TextView
                  style={[
                    styles.titleTab,
                    {
                      color: menuState === 'posted' ? '#fe0000' : '#000',
                    },
                  ]} text='Posted Services' />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          ref={ref => {
            this.scrollref = ref;
          }}
          onScroll={this.onScroll}
          // snapToAlignment={width}
          snapToInterval={width}
          snapToEnd={true}
          snapToStart={false}
          horizontal={true}
          pagingEnabled={true}>
          <Favourited />
          <PostedAdvert />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleTab: {
    color: '#fb0201',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    marginTop: 8,
  },
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    //  justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
    padding: 15,

    shadowOffset: {width: 3, height: 0},
    //  elevation: 5
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
    // marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  favoritedprods: state.fetchFavoritedProducts.favoritedprods,
  postedads: state.fetchMyPostedAdverts.postedads,
});

export default connect(
  mapStateToProps,
  {fetchFavoritedProducts, fetchMyPostedAdverts},
)(MarketplaceFavourited);
