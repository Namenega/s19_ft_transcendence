import Profile from './profilePage/UserAccount'

const Profil = () => {

	
    return (
        <div className="profile-main-ctn">
            <div className="profile-banner-ctn">
		<div className="profile-banner-avatar-ctn">AVATAR</div>
		<div className="profile-banner-statistics-ctn">STATISTICS</div>
	    </div>
	    <div className="profile-history-achievements-ctn">
		    <div className="profile-history-ctn">Match History</div>
		    <div className="profile-achievements-ctn">Achievements</div>
	    </div>
        </div>
    )
	// return (<Profile />)
}

export default Profil
