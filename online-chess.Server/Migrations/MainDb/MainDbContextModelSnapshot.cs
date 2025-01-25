﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using online_chess.Server.Persistence;

#nullable disable

namespace online_chess.Server.Migrations.MainDb
{
    [DbContext(typeof(MainDbContext))]
    partial class MainDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("online_chess.Server.Models.Entities.GameHistory", b =>
                {
                    b.Property<long>("GameHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("GameEndDate")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("GameStartDate")
                        .HasColumnType("TEXT");

                    b.Property<short>("GameType")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsDraw")
                        .HasColumnType("INTEGER");

                    b.Property<short>("PlayerOneColor")
                        .HasColumnType("INTEGER");

                    b.Property<long>("PlayerOneId")
                        .HasColumnType("INTEGER");

                    b.Property<short>("PlayerTwoColor")
                        .HasColumnType("INTEGER");

                    b.Property<long>("PlayerTwoId")
                        .HasColumnType("INTEGER");

                    b.Property<long>("WinnerPlayerId")
                        .HasColumnType("INTEGER");

                    b.HasKey("GameHistoryId");

                    b.ToTable("GameHistories");
                });
#pragma warning restore 612, 618
        }
    }
}
