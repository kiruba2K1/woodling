import React, { Component } from 'react'
import { Text, View } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux';
import { apiurl } from '../constants/config'
import { FlatList } from 'react-native-gesture-handler';
import CompleteStreamComponent from '../components/CompleteStreamComponent';

class ViewTaggedPosts extends Component {
    state = {
        page: 1,
        posts: []
    }
    componentDidMount() {
        const { page } = this.state;
        const { navigation, user_id } = this.props;
        const tag_id = navigation.getParam('item').id
        const data = {
            page,
            user_id,
            tag_id
        }
        axios.post(`${apiurl}search-tag-posts.php`, data)
            .then(res => {
                console.warn(res.data)
                this.setState({ posts: res.data.tag_posts })
            })
            .catch(res => console.warn('Error from our end'))
    }
    render() {
        const { posts } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={posts}
                    onEndReachedThreshold={1}
                    keyExtractor={item => item.post_id}
                    onEndReached={this.onEndReached}
                    // ListFooterComponent={<View>{loading === true ? <ActivityIndicator /> : <Text style={{ fontSize: 25 }}>.</Text>}</View>}
                    contentContainerStyle={{ backgroundColor: '#eeeeee' }}
                    renderItem={({ item, index }) => <CompleteStreamComponent item={item} type={item.type} />
                    }
                />
            </View>
        )
    }
}


const mapStateToProps = state => ({
    user_id: state.userid.id,
    profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(ViewTaggedPosts);