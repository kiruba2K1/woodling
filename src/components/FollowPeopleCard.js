import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import { imageurl } from '../constants/config';
import DefaultAvatar from '../images/ic_account_circle_24px.jpg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import TextView from './TextView';

class FollowPeopleCard extends Component {
    state = {
        follow: false
    }
    follow = () => {
        this.setState({ follow: true })
        // axios
        //     .post(`${apiurl}follow-user.php?user_id=${e.id}&follower_id=${user_id}`)
        //     .then(res => console.log(res.data))
        //     .catch(res => console.log(res.data));
    }

    unFollow = () => {
        this.setState({ follow: false })
    }

    render() {
        const { data, index, item } = this.props
        const { follow } = this.state;
        const showBorder = (index + 1) % 4 === 0 || index === data.length - 1
        return (
            <View style={[styles.root, { borderRightWidth: showBorder === false ? 1 : 0 }]}>
                <Avatar.Image source={item.profile_thumb === '' ? DefaultAvatar : { uri: `${imageurl}/${item.profile_thumb}` }} size={67} />
                <Text style={styles.nameText}>@{item.username}</Text>
                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={parseInt(item.rating)}
                    starSize={8}
                    fullStarColor="red"
                />
                {follow === false ? <TouchableOpacity style={styles.buttonStyle} onPress={this.follow}>
                    <TextView style={styles.buttonText} text='Follow'></TextView>
                </TouchableOpacity> : <TouchableOpacity style={styles.buttonStyle} onPress={this.unFollow}>
                        <TextView style={styles.buttonText} text='Following'></TextView>
                    </TouchableOpacity>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        height: 129,
        width: '24%',
        borderColor: '#ededed',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 5
    },
    nameText: {
        color: '#000000',
        fontFamily: 'Poppins-Medium',
        fontSize: 7,
        fontWeight: '700',
    },
    buttonStyle: {
        height: 20,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: { width: 3, height: 0 },
        shadowRadius: 6,
        borderRadius: 100,
        backgroundColor: '#fecbcb',
    },
    buttonText: {
        color: '#000000',
        fontFamily: 'Poppins-Medium',
        fontSize: 8,
        fontWeight: '700',
    },
})

const mapStateToProps = state => ({
    user_id: state.userid.id,
    profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(FollowPeopleCard);
