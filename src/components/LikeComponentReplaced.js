import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import axios from 'axios';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import { connect } from 'react-redux';
import { apiurl } from '../constants/config.js';
const Customon = createIconSetFromFontello(fontelloConfig);


class LikeComponentReplaced extends Component {
    state = {
        like: false,
    }

    componentDidMount() {
        const { post_id, user_id, like_status } = this.props;
        if (like_status !== null) {
            this.setState({ like: true })
        }
    }
    like = () => {
        const { post_id, user_id, likecount, defaultLikes } = this.props;
        const newcount = parseInt(likecount) + 1;
        this.setState({ like: true })
        const reaction = 'like';
        const data = { user_id, reaction, post_id };
        // console.warn(data);
        axios
            .post(`${apiurl}add-post-reaction.php`, data)
            .then(res => {
                console.warn(res.data);
                defaultLikes(newcount)
            })
            .catch(res => console.log(res.data));
    }

    unlike = () => {
        const { post_id, user_id, likecount, defaultLikes } = this.props;
        const newcount = parseInt(likecount) - 1;
        this.setState({ like: false })
        const reaction = 'unlike';
        const data = { user_id, reaction, post_id };
        // console.warn(data);
        axios
            .post(`${apiurl}add-post-reaction.php`, data)
            .then(res => {
                console.warn(res.data);
                defaultLikes(newcount)
            })
            .catch(res => console.log(res.data));
    }
    render() {
        const { like } = this.state;
        return (
            <View>
                {like == false ? <TouchableOpacity onPress={this.like}>
                    <Customon name="like-icon" size={19} color="#fb0201" />
                </TouchableOpacity> : <TouchableOpacity onPress={this.unlike}>
                        <Customon name="like-selected" size={19} color="#fb0201" />
                    </TouchableOpacity>}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user_id: state.userid.id,
    profilepicture: state.profilepicture.picture
})

export default connect(mapStateToProps)(LikeComponentReplaced);