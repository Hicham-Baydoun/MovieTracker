import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Film, Tv, Save, ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppData } from '@/context/AppDataContext';

export default function AddEdit() {
  const { genres, getContentById, addContent, updateContent } = useAppData();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const contentId = parseInt(id || '0');

  const [contentType, setContentType] = useState<'movie' | 'show'>('movie');
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    genre: [] as string[],
    rating: 7.0,
    synopsis: '',
    poster: 'assets/images/movie1.jpg',
    duration: '',
    director: '',
    cast: [] as string[],
    seasons: 1,
    episodes: 1,
    creator: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newGenre, setNewGenre] = useState('');
  const [newCastMember, setNewCastMember] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const content = getContentById(contentId);
      if (content) {
        setContentType(content.type);
        setFormData({
          title: content.title,
          year: content.year,
          genre: content.genre,
          rating: content.rating,
          synopsis: content.synopsis,
          poster: content.poster,
          duration: 'duration' in content ? content.duration : '',
          director: 'director' in content ? content.director : '',
          cast: content.cast,
          seasons: 'seasons' in content ? content.seasons : 1,
          episodes: 'episodes' in content ? content.episodes : 1,
          creator: 'creator' in content ? content.creator : '',
        });
      }
    }
  }, [isEditMode, contentId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.year || formData.year < 1900 || formData.year > 2100) {
      newErrors.year = 'Please enter a valid year';
    }

    if (formData.genre.length === 0) {
      newErrors.genre = 'At least one genre is required';
    }

    if (!formData.rating || formData.rating < 0 || formData.rating > 10) {
      newErrors.rating = 'Rating must be between 0 and 10';
    }

    if (!formData.synopsis.trim()) {
      newErrors.synopsis = 'Synopsis is required';
    }

    if (contentType === 'movie') {
      if (!formData.duration.trim()) {
        newErrors.duration = 'Duration is required';
      }
      if (!formData.director.trim()) {
        newErrors.director = 'Director is required';
      }
    } else {
      if (!formData.creator.trim()) {
        newErrors.creator = 'Creator is required';
      }
      if (!formData.seasons || formData.seasons < 1) {
        newErrors.seasons = 'Number of seasons is required';
      }
      if (!formData.episodes || formData.episodes < 1) {
        newErrors.episodes = 'Number of episodes is required';
      }
    }

    if (formData.cast.length === 0) {
      newErrors.cast = 'At least one cast member is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const basePayload = {
      title: formData.title.trim(),
      year: Number(formData.year),
      genre: formData.genre,
      rating: Number(formData.rating),
      synopsis: formData.synopsis.trim(),
      poster: formData.poster,
      cast: formData.cast,
    };

    if (contentType === 'movie') {
      const payload = {
        ...basePayload,
        type: 'movie' as const,
        duration: formData.duration.trim(),
        director: formData.director.trim(),
      };

      if (isEditMode) {
        const updated = updateContent(contentId, payload);
        if (!updated) {
          setSubmitError('Unable to update this movie. Please try again.');
          setIsSubmitting(false);
          return;
        }
      } else {
        addContent(payload);
      }
    } else {
      const payload = {
        ...basePayload,
        type: 'show' as const,
        seasons: Number(formData.seasons),
        episodes: Number(formData.episodes),
        creator: formData.creator.trim(),
      };

      if (isEditMode) {
        const updated = updateContent(contentId, payload);
        if (!updated) {
          setSubmitError('Unable to update this TV show. Please try again.');
          setIsSubmitting(false);
          return;
        }
      } else {
        addContent(payload);
      }
    }

    setIsSubmitting(false);
    navigate('/browse');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'title' || name === 'duration' || name === 'director' || name === 'creator' || name === 'synopsis' ? value : parseFloat(value) || value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const addGenre = () => {
    if (newGenre && !formData.genre.includes(newGenre)) {
      setFormData((prev) => ({ ...prev, genre: [...prev.genre, newGenre] }));
      setNewGenre('');
    }
  };

  const removeGenre = (genre: string) => {
    setFormData((prev) => ({ ...prev, genre: prev.genre.filter((g) => g !== genre) }));
  };

  const addCastMember = () => {
    if (newCastMember && !formData.cast.includes(newCastMember)) {
      setFormData((prev) => ({ ...prev, cast: [...prev.cast, newCastMember] }));
      setNewCastMember('');
    }
  };

  const removeCastMember = (member: string) => {
    setFormData((prev) => ({ ...prev, cast: prev.cast.filter((c) => c !== member) }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {isEditMode ? 'Edit Content' : 'Add New Content'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Edit Movie/TV Show Details' : 'Enter Movie/TV Show Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submitError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isEditMode && (
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={contentType === 'movie' ? 'default' : 'outline'}
                      onClick={() => {
                        setContentType('movie');
                        setFormData((prev) => ({ ...prev, poster: 'assets/images/movie1.jpg' }));
                      }}
                      className="flex-1"
                    >
                      <Film className="mr-2 h-4 w-4" />
                      Movie
                    </Button>
                    <Button
                      type="button"
                      variant={contentType === 'show' ? 'default' : 'outline'}
                      onClick={() => {
                        setContentType('show');
                        setFormData((prev) => ({ ...prev, poster: 'assets/images/show1.jpg' }));
                      }}
                      className="flex-1"
                    >
                      <Tv className="mr-2 h-4 w-4" />
                      TV Show
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter title"
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Enter year"
                    className={errors.year ? 'border-destructive' : ''}
                  />
                  {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-10) *</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="Enter rating"
                  className={errors.rating ? 'border-destructive' : ''}
                />
                {errors.rating && <p className="text-sm text-destructive">{errors.rating}</p>}
              </div>

              <div className="space-y-2">
                <Label>Genres *</Label>
                <div className="flex gap-2">
                  <Select value={newGenre} onValueChange={setNewGenre}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addGenre} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.genre.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                    >
                      {g}
                      <button
                        type="button"
                        onClick={() => removeGenre(g)}
                        className="ml-2 text-primary hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.genre && <p className="text-sm text-destructive">{errors.genre}</p>}
              </div>

              {contentType === 'movie' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 2h 15m"
                      className={errors.duration ? 'border-destructive' : ''}
                    />
                    {errors.duration && (
                      <p className="text-sm text-destructive">{errors.duration}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="director">Director *</Label>
                    <Input
                      id="director"
                      name="director"
                      value={formData.director}
                      onChange={handleChange}
                      placeholder="Enter director name"
                      className={errors.director ? 'border-destructive' : ''}
                    />
                    {errors.director && (
                      <p className="text-sm text-destructive">{errors.director}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creator">Creator *</Label>
                    <Input
                      id="creator"
                      name="creator"
                      value={formData.creator}
                      onChange={handleChange}
                      placeholder="Enter creator name"
                      className={errors.creator ? 'border-destructive' : ''}
                    />
                    {errors.creator && (
                      <p className="text-sm text-destructive">{errors.creator}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seasons">Seasons *</Label>
                    <Input
                      id="seasons"
                      name="seasons"
                      type="number"
                      min="1"
                      value={formData.seasons}
                      onChange={handleChange}
                      placeholder="Number of seasons"
                      className={errors.seasons ? 'border-destructive' : ''}
                    />
                    {errors.seasons && (
                      <p className="text-sm text-destructive">{errors.seasons}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="episodes">Episodes *</Label>
                    <Input
                      id="episodes"
                      name="episodes"
                      type="number"
                      min="1"
                      value={formData.episodes}
                      onChange={handleChange}
                      placeholder="Total episodes"
                      className={errors.episodes ? 'border-destructive' : ''}
                    />
                    {errors.episodes && (
                      <p className="text-sm text-destructive">{errors.episodes}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Cast Members *</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCastMember}
                    onChange={(e) => setNewCastMember(e.target.value)}
                    placeholder="Enter cast member name"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCastMember())}
                  />
                  <Button type="button" onClick={addCastMember} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.cast.map((member) => (
                    <span
                      key={member}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                    >
                      {member}
                      <button
                        type="button"
                        onClick={() => removeCastMember(member)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.cast && <p className="text-sm text-destructive">{errors.cast}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="synopsis">Synopsis *</Label>
                <Textarea
                  id="synopsis"
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleChange}
                  placeholder="Enter synopsis"
                  rows={4}
                  className={errors.synopsis ? 'border-destructive' : ''}
                />
                {errors.synopsis && <p className="text-sm text-destructive">{errors.synopsis}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : isEditMode ? 'Update Content' : 'Add Content'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

