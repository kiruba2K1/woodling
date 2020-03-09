import { combineReducers } from 'redux';
import register from './register';
import login from './loginAuth';
import roles from './roles';
import accounttype from './accountType';
import individualform from './individualform';
import followerslist from './fetchfollowers';
import newpostnavigation from './newpostnavigation';
import addpost from './handleyourmind';
import userid from './userid';
import castingcallsdata from './postajob';
import profileAlbums from './profileAlbums';
import reviews from './fetchUserProfileReviews';
import followinglist from './fetchfollowing';
import profileposts from './profileActivityPosts';
import taggedposts from './profileTaggedPosts';
import profilepicture from './profilePicture';
import trendinghashtags from './fetchtrendinghashtags';
import exploreusers from './fetchExploreUsers';
import eventtypes from './eventType';
import activitystreamdata from './viewActivityStream';
import viewPostDetail from './viewPostDetails';
import fetchPostComments from './fetchPostComments';
import fetchProductionType from './fetchProductionType';
import fetchMyPostedAdverts from './fetchMyPostedAdverts';
import fetchFavoritedProducts from './fetchFavoritedProducts';
import PostCommentsReply from './PostCommentsReply';
import searchForPeople from './searchForPeople';
import searchForCalls from './searchForCastingCalls';
import generalSearch from './generalSearch';
import searchForPosts from './searchForPosts';
import searchForProducts from './searchForProducts';
import searchForEvents from './searchForEvents';
import searchPlaceByPeople from './searchPlaceByPeople';
import searchPlacePosts from './searchPlacePosts';

export default combineReducers({
  register,
  login,
  roles,
  accounttype,
  individualform,
  followerslist,
  newpostnavigation,
  addpost,
  userid,
  profilepicture,
  castingcallsdata,
  profileAlbums,
  reviews,
  followinglist,
  profileposts,
  taggedposts,
  trendinghashtags,
  exploreusers,
  eventtypes,
  activitystreamdata,
  viewPostDetail,
  fetchPostComments,
  PostCommentsReply,
  fetchProductionType,
  fetchMyPostedAdverts,
  fetchFavoritedProducts,
  generalSearch,
  searchForPeople,
  searchForCalls,
  searchForPosts,
  searchForProducts,
  searchForEvents,
  searchPlaceByPeople,
  searchPlacePosts
});
