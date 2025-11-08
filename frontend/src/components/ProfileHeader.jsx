import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import avatarImg from '../assets/images/avatar.png';
import {LoaderIcon, LogOutIcon, Volume2Icon, VolumeOffIcon} from 'lucide-react';
import { toggleTone } from '../store/slices/chatSlice';
import { updateProfile } from '../store/slices/authSlice';

const mouseClickSound = new Audio('/sounds/mouse-click.mp3');
export default function ProfileHeader() {
  const dispatch = useDispatch();
  const { authUser, isUpdatingProfile } = useSelector(state => state.auth);
  const { isToneEnabled } = useSelector(state => state.chat);
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInput = useRef(null);
  console.log(isToneEnabled);
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async()=>{
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await dispatch(updateProfile({profilePicture: base64Image}));
    }
  }
  return (
    <div className="p-6 border-b border-slate-700/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar online">
            <button 
            className="size-14 rounded-full overflow-hidden relative-group border-2 border-slate-500/70 hover:border-slate-300/80 transition-border"
            onClick={() => fileInput.current.click()}
            >
              <img 
              src={selectedImage ||authUser?.profilePicture || avatarImg} 
              alt="profile" 
              className='object-cover size-full'
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 rounded-3xl
              flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>

              </div>

              {isUpdatingProfile && 
              (
                <div className="absolute inset-0 bg-black/50 opacity-100 rounded-3xl flex items-center justify-center transition-opacity">
                  <LoaderIcon className="size-10 animate-spin" />
                </div>
              )}


            </button>
            <input 
              type="file" 
              accept='image/*'
              ref={fileInput}
              onChange={handleImageUpload}
              className='hidden'
            />
          </div>

          {/* details */}

          <div >
            <h3 className="text-slate-300 font-medium text-base max-w-[180px] truncate">
              {authUser?.username}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>

          <div className="flex gap-4 items-center">
            <button className='text-slate-400 hover:text-slate-300 transition-colors'>
              <LogOutIcon className="size-5" />
            </button>

            <button 
            className='text-slate-400 hover:text-slate-300 transition-colors'
            onClick={()=>{
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((error)=>console.log("Audio play failed",error));
              dispatch(toggleTone());
            }}
            >
              {isToneEnabled ? 
              (
              <Volume2Icon className="size-5"/>
              ) : (
              <VolumeOffIcon className="size-5"/>
              )}
            </button>

          
          </div>
        </div>
      </div>
    </div>
  )
}
