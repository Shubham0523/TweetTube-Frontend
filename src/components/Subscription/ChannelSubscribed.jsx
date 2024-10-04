import { useState, useEffect } from "react";
import {
  EmptySubscription,
  MyChannelEmptySubscribed,
  SubscriptionUser,
} from "../index";
import { useDispatch, useSelector } from "react-redux";
import { getChannelSubscribers, getSubscribedChannels } from "../../app/Slices/subscriptionSlice";
import { useParams } from "react-router-dom";

function ChannelSubscribed({ owner = false, isSubscribers = false }) {
  const dispatch = useDispatch();
  const { username } = useParams();
  const currentUser = useSelector((state) => state.auth.userData);
  const userData = useSelector((state) => state.user.userData);
  
  const effectiveChannelId = owner ? currentUser?._id : userData?._id;
  
  const [subscribedFiltered, setSubscribedFiltered] = useState(null);
  const { data, loading, status } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (!currentUser?._id) return;
    
    if (isSubscribers) {
      dispatch(getChannelSubscribers(currentUser._id));
    } else {
      if (!effectiveChannelId) return;
      dispatch(getSubscribedChannels(effectiveChannelId));
    }
  }, [dispatch, currentUser?._id, effectiveChannelId, isSubscribers]);

  if (!isSubscribers && (loading || !effectiveChannelId)) {
    return <LoadingState />;
  }

  if ((!status && !loading) || !data) {
    return (
      <div className="flex w-full h-screen flex-col gap-y-4 px-16 py-4 rounded dark:bg-slate-100/10 bg-zinc-300 animate-pulse" />
    );
  }

  // Transform subscription data to match SubscriptionUser expectations
  const transformSubscriptionData = (data) => {
    if (!data) return [];

    // Handle subscribers data structure
    if (data.subscribers) {
      return data.subscribers
        .filter(sub => sub && sub.subscriber) // Filter out null subscribers
        .map(sub => ({
          _id: sub.subscriber._id,
          username: sub.subscriber.username,
          fullName: sub.subscriber.fullName,
          avatar: sub.subscriber.avatar,
          subscribersCount: sub.subscriber.subscribersCount || 0,
          isSubscribed: true
        }));
    }

    // Handle subscribed channels data structure
    if (data.subscribedChannels) {
      return data.subscribedChannels
        .filter(sub => sub && sub.channel)
        .map(sub => ({
          _id: sub.channel._id,
          username: sub.channel.username,
          fullName: sub.channel.fullName,
          avatar: sub.channel.avatar,
          subscribersCount: sub.channel.subscribersCount || 0,
          isSubscribed: true
        }));
    }

    // Handle direct array
    if (Array.isArray(data)) {
      return data
        .filter(sub => sub && (sub.channel || sub.subscriber))
        .map(sub => {
          const profile = isSubscribers ? sub.subscriber : sub.channel;
          return {
            _id: profile._id,
            username: profile.username,
            fullName: profile.fullName,
            avatar: profile.avatar,
            subscribersCount: profile.subscribersCount || 0,
            isSubscribed: true
          };
        });
    }

    console.error('Unexpected data structure:', data);
    return [];
  };

  const validSubscriptions = transformSubscriptionData(data);
  // console.log('Transformed subscriptions:', validSubscriptions);

  const handleUserInput = (input) => {
    if (!input) {
      setSubscribedFiltered(null);
    } else {
      const filteredData = validSubscriptions.filter((profile) =>
        profile.fullName?.toLowerCase().includes(input.toLowerCase())
      );
      setSubscribedFiltered(filteredData);
    }
  };

  const displayData = subscribedFiltered || validSubscriptions;

  // If no valid data to display
  if (!displayData?.length) {
    return owner ? <MyChannelEmptySubscribed /> : <EmptySubscription />;
  }

  return (
    <ul className={`flex w-full flex-col gap-y-4 ${isSubscribers ? "px-8 py-8 sm:px-16 sm:py-12" : "py-4"}`}>
      <SearchBar onSearch={handleUserInput} />
      {displayData.map((profile) => {
        if (!profile?._id) {
          // console.log('Skipping invalid profile:', profile);
          return null;
        }

        return (
          <SubscriptionUser 
            key={profile._id} 
            profile={profile}
          />
        );
      })}
    </ul>
  );
}

// SearchBar component
const SearchBar = ({ onSearch }) => (
  <div className="relative mb-2 rounded-lg dark:bg-white bg-zinc-100 py-2 pl-8 pr-3 text-black">
    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </span>
    <input
      onChange={(e) => onSearch(e.target.value.trim())}
      className="w-full bg-transparent outline-none"
      placeholder="Search"
    />
  </div>
);

// LoadingState component
const LoadingState = () => (
  <div className="flex flex-col gap-y-4 pt-1">
    <div className="flex flex-col gap-y-4 pt-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex w-full justify-between">
          <div className="flex items-center gap-x-2">
            <div className="h-14 w-14 shrink-0 dark:bg-slate-100/10 bg-zinc-300 rounded-full animate-pulse" />
            <div className="block">
              <h6 className="font-semibold mb-2 dark:bg-slate-100/10 bg-zinc-300 animate-pulse h-4 w-24 rounded" />
              <p className="text-sm dark:bg-slate-100/10 bg-zinc-300 animate-pulse h-4 w-32 rounded" />
            </div>
          </div>
          <div className="block">
            <div className="group/btn px-3 py-2 text-black dark:bg-slate-100/10 bg-zinc-300 rounded-sm animate-pulse">
              <span className="inline-block w-24 h-4 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ChannelSubscribed;