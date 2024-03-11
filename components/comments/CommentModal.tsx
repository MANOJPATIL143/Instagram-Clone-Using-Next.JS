import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import {
  BsBookmark,
  BsChat,
  BsChevronLeft,
  BsHeart,
  BsHeartFill,
  BsSend,
} from "react-icons/bs";
import AddComment from "./AddComment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { closePostModal } from "../../redux/slices/modalSlice";
import formattedDate from "../../lib/utils/formatedDate";
import { IError, IPost } from "../../lib/interface";
import { deleteComment, getSinglePost } from "../../lib/requests";
import { useProfileData } from "../../hooks";
import CommentBox from "./CommentBox";

const CommentModal = () => {
  const { userData } = useProfileData();

  const [liked, setLiked] = useState(false);

  const dispatch = useAppDispatch();
  const { postModal } = useAppSelector((state) => state.modal);

  const handelLike = () => {};

  const { data: postData, isLoading } = useQuery({
    queryKey: ["posts", postModal.id],
    queryFn: () => getSinglePost(postModal.id),
    onError: (error: IError) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      {postData && Object.keys(postData).length > 0 && (
        <div className="block sm:flex items-center justify-center overlay max-sm:bg-white max-h-screen sm:py-6">
          <button
            className="hidden sm:block absolute top-5 right-5 z-20 text-white"
            onClick={() => dispatch(closePostModal(false))}
          >
            <MdClose className="w-6 h-6" />
          </button>

          {/* COMMENT CONTENT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:mx-16 sm:h-[calc(100vh_-_48px)] overflow-hidden sm:rounded-sm auto-rows-[100%]">
            {/* IMAGE BOX - FOR DESKTOP */}
            <div className="hidden sm:block bg-gray-50">
              <Image
                width={500}
                height={500}
                src={postData?.img}
                alt={postData?.userId?.username}
                className="!h-full w-full object-contain"
              />
            </div>

            {/* COMMENT CONTAINER */}
            <div className="bg-white">
              {/* BACK BUTTON FOR MOBILE */}
              <div className="flex items-center gap-4 p-2 sm:hidden border-b">
                <button
                  className=""
                  onClick={() => dispatch(closePostModal(false))}
                >
                  <BsChevronLeft className="w-5 h-5" />
                </button>
                <p className="flex-1">Comments</p>
                <button>
                  <BsSend />
                </button>
              </div>

              {/* USER CAPTION BOX */}
              <div className="flex p-2 gap-4 overflow-hidden border-b">
                <Image
                  src={postData?.userId?.profilePicture || "/blank-profile.jpg"}
                  width={80}
                  height={80}
                  alt={postData?.userId?.username}
                  className="object-cover rounded-full w-10 !h-10"
                />
                <div>
                  <div className="font-medium">
                    {postData?.userId?.username}{" "}
                    <span className="font-normal text-gray-500 text-sm">
                      {formattedDate(postData?.createdAt)}
                    </span>
                  </div>
                  <div>{postData?.caption}</div>
                </div>
              </div>

              {/* COMMENT BOX */}
              <CommentBox
                postData={postData}
                postId={postModal.id}
                extraClass="h-[74%] sm:h-[66%]"
              />

              {/* COMMENT FORM */}
              <div>
                <div className="md:flex justify-between py-3 px-2 hidden">
                  <div className="flex space-x-4 items-center">
                    <button onClick={handelLike}>
                      {!liked ? (
                        <BsHeart className="btn" />
                      ) : (
                        <BsHeartFill className="btn text-red-500" />
                      )}
                    </button>
                    <button onClick={() => {}}>
                      <BsChat className="btn" />
                    </button>
                    <BsSend className="btn " />
                  </div>
                  <div>
                    <BsBookmark className="btn" />
                  </div>
                </div>

                {postData?.likes && (
                  <div
                    className="px-2 cursor-pointer hidden md:block"
                    onClick={() => {}}
                  >
                    {postData?.likes.length} likes
                  </div>
                )}

                <AddComment id={postData?._id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentModal;
