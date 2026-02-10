import { useForm } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@components/base/card';
import { TextField } from '@components/base/text-field';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import {
  User,
  Mail,
  ImageIcon,
  Save,
  ShieldCheck,
  UserCircle,
} from 'lucide-react';
import { useGetProfile } from '@hooks/profile/use-get-profile';
import { useUpdateProfile } from '@hooks/profile/use-edit-profile';
import type { UpdateProfileRequest } from '@services/profile.service';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';

export default function ProfilePage() {
  const { data: me, isLoading, error } = useGetProfile();
  const updateMe = useUpdateProfile();

  const form = useForm<UpdateProfileRequest>({
    values: me
      ? {
          fullname: me.fullname ?? '',
          email: me.email ?? '',
          avatar: me.avatar ?? '',
        }
      : undefined,
  });

  if (isLoading) {
    return <LoadingState message='Loading profile...' />;
  }

  if (error || !me) {
    return (
      <ErrorState
        title='Error loading profile'
        message={error?.message || 'Unable to fetch your profile'}
      />
    );
  }

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <Card>
        <CardHeader className='gap-3'>
          <CardIcon>
            <div className='w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden'>
              {me.avatar ? (
                <img
                  src={me.avatar}
                  alt={me.username}
                  className='w-full h-full object-cover'
                />
              ) : (
                <User className='w-7 h-7 text-foreground' />
              )}
            </div>
          </CardIcon>
          <div className='flex flex-col items-start gap-1'>
            <CardTitle>{me.username}</CardTitle>
            <CardDescription>Your account profile</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-2'>
          {me.is_sudo && (
            <Badge variant='purple'>
              <ShieldCheck className='w-3 h-3' />
              Sudo
            </Badge>
          )}
          {(me.scope ?? []).slice(0, 6).map((s) => (
            <Badge key={s} variant='outline'>
              {s}
            </Badge>
          ))}
          {(me.scope?.length ?? 0) > 6 && (
            <Badge variant='outline'>+{(me.scope?.length ?? 0) - 6}</Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardIcon>
            <UserCircle className='w-5 h-5' />
          </CardIcon>
          <div className='flex flex-wrap items-center gap-2'>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit((v) => updateMe.mutate(v))}
          >
            <TextField
              label='Full Name'
              icon={<User className='w-4 h-4' />}
              placeholder='Enter your full name'
              {...form.register('fullname')}
            />

            <TextField
              label='Email'
              icon={<Mail className='w-4 h-4' />}
              type='email'
              placeholder='Enter your email'
              {...form.register('email')}
              error={form.formState.errors.email?.message}
            />

            <TextField
              label='Avatar URL'
              icon={<ImageIcon className='w-4 h-4' />}
              placeholder='https://...'
              description='Direct link to your avatar image'
              {...form.register('avatar')}
            />

            <Button
              type='submit'
              className='w-full'
              disabled={updateMe.isPending}
            >
              <Save className='w-4 h-4' />
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
