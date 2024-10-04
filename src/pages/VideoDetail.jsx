/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  emptyVideosState,
  getVideo,
  updateView,
} from "../app/Slices/videoSlice";
import {
  Comments,
  LikesComponent,
  LoginPopup,
  VideoPlayer,
} from "../components/index";
import { formatTimestamp } from "../helpers/formatFigures";
import UserProfile from "../components/Atoms/UserProfile";
import {
  addVideoToPlaylist,
  createPlaylist,
  getCurrentPlaylists,
  removeVideoFromPlaylist,
} from "../app/Slices/playlistSlice";
import { toast } from "react-toastify";

import FeedVideos from "./FeedVideos";

function VideoDetail() {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { videoId } = useParams();
  // const loginPopupDialog = useRef();
  // const playerRef = useRef(null);

  // const { status: authStatus } = useSelector(({ auth }) => auth);
  // const { loading, status, data: video } = useSelector(({ video }) => video);

  const {
    loading: playlistLoading,
    status: playlistStatus,
    data: playlists,
  } = useSelector((state) => state.playlist);

  // useEffect(() => {
  //   if (!videoId) return;
  //   dispatch(getVideo(videoId));
  //   dispatch(updateView(videoId));
  //   return () => dispatch(emptyVideosState());
  // }, [videoId, navigate]);

  // Iteration2
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { videoId } = useParams();
  const loginPopupDialog = useRef();
  const playerRef = useRef(null);

  const { status: authStatus } = useSelector(({ auth }) => auth);
  const { loading, status, data: video } = useSelector(({ video }) => video);
  // console.log("videodata", video);

  useEffect(() => {
    if (!videoId) return;
    dispatch(getVideo(videoId));
    dispatch(updateView(videoId));
    return () => {
      // Only clear video data when navigating away
      if (window.location.pathname !== `/watch/${videoId}`) {
        dispatch(emptyVideosState());
      }
    };
  }, [videoId, navigate]);

  function handlePlaylistVideo(playlistId, status) {
    if (!playlistId && !status) return;

    if (status) dispatch(addVideoToPlaylist({ playlistId, videoId }));
    else dispatch(removeVideoFromPlaylist({ playlistId, videoId }));
  }

  function handleCreateNewPlaylist(eventObj) {
    eventObj.preventDefault();
    const name = eventObj.target.name.value;

    if (!name.trim()) return toast.error("Please enter the playlist name");

    dispatch(createPlaylist({ data: { name } })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(addVideoToPlaylist({ playlistId: res.payload?._id, videoId }));
      }
    });
  }

  function handleSavePlaylist() {
    if (authStatus) {
      dispatch(getCurrentPlaylists(videoId));
    } else {
      loginPopupDialog.current?.open();
    }
  }

  // Loading start
  if (loading)
    return (
      <section className="w-full pb-[70px] sm:pb-0">
        {/* sm:ml-[70px] */}
        <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
          <div className="col-span-12 w-full">
            {/* video */}
            <div className="relative mb-4 w-full pt-[56%]">
              <div className="absolute inset-0">
                <div className="size-full dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* video, Playlist, Like and owner data */}
            <div
              className="group mb-4 w-full rounded-lg border p-4 duration-200 hover:bg-white/5 focus:bg-white/5"
              role="button"
              tabIndex="0"
            >
              <div className="flex flex-wrap gap-y-2">
                {/* video metadata */}
                <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                  <h1 className=" w-full h-9 text-transparent dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse"></h1>
                  <h1 className=" w-1/2 h-5 mt-3 text-transparent dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse"></h1>
                </div>
                {/* Like and playlist component */}
                <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                  <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                    <div className="relative block">
                      <div className="peer flex w-32 h-10 items-center gap-x-2 px-4 py-1.5 text-transparent dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* owner metadata */}
              <UserProfile />
              <hr className="my-4 border-white" />
            </div>

            {/* comments */}
            <Comments videoId={video?._id} ownerAvatar={video?.owner?.avatar} />
          </div>

          {/* side video suggegtions */}
          <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
            <div className="w-full gap-x-2 border pr-2 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <div className="dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse h-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                <div className="h-12 w-12 shrink-0 md:hidden">
                  <div className="dark:bg-slate-100/10 bg-zinc-200 animate-pulse h-full w-full rounded-full"></div>
                </div>
                <div className="w-full pt-1 md:pt-0">
                  <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></h6>
                  <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                  <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                </div>
              </div>
            </div>
            <div className="w-full gap-x-2 border pr-2 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <div className="dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse h-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                <div className="h-12 w-12 shrink-0 md:hidden">
                  <div className="dark:bg-slate-100/10 bg-zinc-200 animate-pulse h-full w-full rounded-full"></div>
                </div>
                <div className="w-full pt-1 md:pt-0">
                  <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></h6>
                  <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                  <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                </div>
              </div>
            </div>
            <div className="w-full gap-x-2 border pr-2 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <div className="dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse h-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                <div className="h-12 w-12 shrink-0 md:hidden">
                  <div className="dark:bg-slate-100/10 bg-zinc-200 animate-pulse h-full w-full rounded-full"></div>
                </div>
                <div className="w-full pt-1 md:pt-0">
                  <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></h6>
                  <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                  <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                </div>
              </div>
            </div>
            <div className="w-full gap-x-2 border pr-2 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <div className="dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse h-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                <div className="h-12 w-12 shrink-0 md:hidden">
                  <div className="dark:bg-slate-100/10 bg-zinc-200 animate-pulse h-full w-full rounded-full"></div>
                </div>
                <div className="w-full pt-1 md:pt-0">
                  <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></h6>
                  <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                  <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                </div>
              </div>
            </div>
            <div className="w-full gap-x-2 border pr-2 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <div className="dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse h-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                <div className="h-12 w-12 shrink-0 md:hidden">
                  <div className="dark:bg-slate-100/10 bg-zinc-200 animate-pulse h-full w-full rounded-full"></div>
                </div>
                <div className="w-full pt-1 md:pt-0">
                  <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></h6>
                  <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                  <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                </div>
              </div>
            </div>
            <div className="w-full gap-x-2 border pr-2 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <div className="dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse h-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                <div className="h-12 w-12 shrink-0 md:hidden">
                  <div className="dark:bg-slate-100/10 bg-zinc-200 animate-pulse h-full w-full rounded-full"></div>
                </div>
                <div className="w-full pt-1 md:pt-0">
                  <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></h6>
                  <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                  <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                </div>
              </div>
            </div>
            <div className="w-full gap-x-2 border pr-2 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <div className="dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse h-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                <div className="h-12 w-12 shrink-0 md:hidden">
                  <div className="dark:bg-slate-100/10 bg-zinc-200 animate-pulse h-full w-full rounded-full"></div>
                </div>
                <div className="w-full pt-1 md:pt-0">
                  <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></h6>
                  <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                  <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                </div>
              </div>
            </div>
            <div className="w-full gap-x-2 border pr-2 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <div className="dark:bg-slate-100/10 bg-zinc-200 rounded animate-pulse h-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                <div className="h-12 w-12 shrink-0 md:hidden">
                  <div className="dark:bg-slate-100/10 bg-zinc-200 animate-pulse h-full w-full rounded-full"></div>
                </div>
                <div className="w-full pt-1 md:pt-0">
                  <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></h6>
                  <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                  <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm dark:bg-slate-100/10 bg-zinc-200 animate-pulse text-transparent"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  // Loading End

  if (!status || !video)
    return (
      <div className="flex w-full h-screen flex-col gap-y-4 px-16 py-4 rounded dark:bg-slate-100/10 bg-zinc-200 animate-pulse"></div>
    );

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: video?.videoFile,
        type: "video/mp4",
      },
    ],
  };

  // console.log("this is video options at[0] index", videoPlayerOptions);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };

  return video && !loading ? (
    <section className="w-full pb-[70px] sm:pb-0">
      {/* sm:ml-[70px] */}
      <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
        <div className="col-span-12 w-full">
          {/* video */}
          <div className="relative mb-4 w-full pt-[56%] overflow-hidden">
            <div className="absolute inset-0">
              {/* <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} /> */}
              <VideoPlayer
                src={video?.videoFile}
                thumbnail={video?.thumbnail}
                title={video?.title}
                duration={video?.duration}
                autoPlay={true}
              />
            </div>
          </div>

          {/* video, Playlist, Like and owner data */}
          <div
            className="group mb-4 w-full rounded-lg border p-4 duration-200 hover:bg-white/5 focus:bg-white/5 drop-shadow"
            role="button"
            tabIndex="0"
          >
            <div className="flex flex-wrap gap-y-2">
              {/* video metadata */}
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <h1 className="text-lg font-bold">{video?.title}</h1>
                <p className="flex text-sm dark:text-gray-200 text-[#333] ">
                  {video?.views} Views · {formatTimestamp(video?.createdAt)}
                </p>
              </div>
              {/* Like and playlist component */}
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                  {/* Likes*/}
                  {/* <LikesComponent
                    videoId={video._id}
                    isLiked={video.isLiked}
                    totalLikes={video.totalLikes}
                    isDisLiked={video.isDisLiked}
                    totalDisLikes={video.totalDisLikes}
                  /> */}

                  {/* Iteration 2 */}
                  <LikesComponent
                    videoId={video._id}
                    isLiked={video.isLiked}
                    totalLikes={video.totalLikes}
                    isDisLiked={video.isDisLiked}
                    totalDisLikes={video.totalDisLikes}
                    key={`${video._id}-${video.isLiked}-${video.totalLikes}`} // Add key to force re-render on like changes
                  />

                  {/* Playlist */}
                  <div className="relative block">
                    <LoginPopup
                      ref={loginPopupDialog}
                      message="Sign in to Save video in Playlist..."
                    />
                    {/* Save to Playlist Button */}
                    <button
                      onClick={handleSavePlaylist}
                      className="peer flex items-center gap-x-2 rounded-lg dark:bg-white dark:focus:bg-zinc-200 bg-[#42c842] focus:bg-[#2a821a]  px-4 py-1.5 dark:text-black text-white "
                    >
                      <span className="inline-block w-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                          ></path>
                        </svg>
                      </span>
                      Save
                    </button>
                    {/* save to playlist popup */}
                    {/* OPTIMIZEME: FIX glitch and improve user experience */}
                    {authStatus && (
                      <div className="absolute right-0 top-full z-10 hidden w-64 overflow-hidden rounded-lg dark:bg-[#121212] bg-zinc-300 drop-shadow-sm p-4 shadow shadow-slate-50/30 hover:block peer-focus:block">
                        <h3 className="mb-4 text-center text-lg font-semibold">
                          Save to playlist
                        </h3>
                        <ul className="mb-4">
                          {playlistLoading && (
                            <li className="mb-2 last:mb-0">
                              <label
                                className="group/label inline-flex cursor-pointer items-center gap-x-3"
                                htmlFor="Collections-checkbox"
                              >
                                Please Wait...
                              </label>
                            </li>
                          )}
                          {playlists?.length > 0 &&
                            playlists?.map((item) => (
                              <li key={item._id} className="mb-2 last:mb-0">
                                <label
                                  className="group/label inline-flex cursor-pointer items-center gap-x-3"
                                  htmlFor={"Collections-checkbox" + item._id}
                                >
                                  <input
                                    type="checkbox"
                                    className="peer hidden"
                                    id={"Collections-checkbox" + item._id}
                                    defaultChecked={item.isVideoPresent}
                                    onChange={(e) =>
                                      handlePlaylistVideo(
                                        item._id,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] border border-transparent bg-white text-white group-hover/label:border-[#ae7aff] peer-checked:border-[#ae7aff] peer-checked:text-[#ae7aff]">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="3"
                                      stroke="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                      ></path>
                                    </svg>
                                  </span>
                                  {item.name}
                                </label>
                              </li>
                            ))}
                        </ul>

                        {/* Create new playlist */}
                        <form
                          onSubmit={handleCreateNewPlaylist}
                          className="flex flex-col"
                        >
                          <label
                            htmlFor="playlist-name"
                            className="mb-1 inline-block cursor-pointer"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="playlist-name"
                            placeholder="Enter playlist name"
                            required
                            className="w-full rounded-lg border border-transparent bg-white px-3 py-2 text-black outline-none focus:border-[#ae7aff]"
                          />
                          <button
                            type="submit"
                            className="mx-auto mt-4 rounded-lg dark:bg-[#ae7aff] bg-[#ed6c6c] px-4 py-2 text-black"
                          >
                            Create new playlist
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* owner metadata */}
            <UserProfile userId={video?.owner?.username} />
            <hr className="my-4 dark:border-white border-red-200 " />
            {/* description */}
            <div className="h-5 overflow-hidden group-focus:h-auto">
              <p className="text-sm dark:text-white text-black  ">
                {video?.description}
              </p>
            </div>
          </div>

          <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
            <h6 className="font-semibold">Comments...</h6>
          </button>

          {/* comments */}
          {!loading && (
            <Comments videoId={videoId} ownerAvatar={video?.owner?.avatar} />
          )}
        </div>

        <main className=" ">
          <FeedVideos
            gridClassName="w-full pb-[0px] sm:ml-[0px] sm:pb-0 lg:ml-0 "
            itemClassName=" grid grid-cols-[repeat(1,_minmax(370px,_1fr))]  sm:grid-cols-[repeat(2,_minmax(300px,_1fr))] md:grid-cols-[repeat(2,_minmax(350px,_1fr))] lg:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))] gap-4  "
          />
        </main>
      </div>
    </section>
  ) : (
    // something wrong
    <div className="flex w-full h-screen flex-col gap-y-4 px-16 py-4 rounded dark:bg-slate-100/10 bg-zinc-200 animate-pulse"></div>
  );
}

export default VideoDetail;
